package project.repo.service;

import lombok.RequiredArgsConstructor;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.clients.PartClient;
import project.repo.clients.UserClient;
import project.repo.clients.VehicleClient;
import project.repo.clients.PaymentClient;
import project.repo.dtos.NotificationEvent;
import project.repo.dtos.OrderChecklistItemDTO;
import project.repo.dtos.OrderDTO;
import project.repo.dtos.OrderPartDTO;
import project.repo.dtos.PartsDTO;
import project.repo.dtos.PaymentDto;
import project.repo.entity.Order;
import project.repo.entity.OrderChecklistItem;
import project.repo.entity.OrderPart;
import project.repo.mapper.OrderMapper;
import project.repo.repository.OrderChecklistItemRepository;
import project.repo.repository.OrderPartRepository;
import project.repo.repository.OrderRepository;
import project.repo.config.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderChecklistItemRepository checklistRepository;
    private final OrderPartRepository orderPartRepository; // Inject thêm Repo này
    private final OrderMapper orderMapper;
    
    private final UserClient userClient;
    private final VehicleClient vehicleClient;
    private final PartClient partClient;
    private final PaymentClient paymentClient;
    private final RabbitTemplate rabbitTemplate;

    public OrderDTO createOrderFromAppointment(OrderDTO dto) {
        Order order = Order.builder()
                .appointmentId(dto.getAppointmentId())
                .customerId(dto.getCustomerId())
                .vehicleId(dto.getVehicleId())
                .technicianId(dto.getTechnicianId())
                .status(Order.OrderStatus.PENDING)
                .totalCost(0.0)
                .serviceType(dto.getServiceType())
                .build();

        Order savedOrder = orderRepository.save(order);

        List<String> defaultChecklist = getDefaultChecklist(dto.getServiceType());
        List<OrderChecklistItem> checklist = defaultChecklist.stream()
                .map(task -> OrderChecklistItem.builder()
                        .order(savedOrder)
                        .description(task)
                        .status(OrderChecklistItem.ChecklistStatus.PENDING)
                        .build())
                .collect(Collectors.toList());

        checklistRepository.saveAll(checklist);
        savedOrder.setChecklistItems(checklist);
        sendNotification(
            savedOrder.getCustomerId(),
            "Lịch hẹn được xác nhận ✅",
            "Đơn hàng #" + savedOrder.getId() + " đã được tạo. Vui lòng mang xe đến đúng giờ.",
            "ORDER_CREATED"
        );
        return enrichOrderDTO(savedOrder);
    }

    public OrderDTO getOrderWithChecklist(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return enrichOrderDTO(order);
    }

    public OrderDTO getOrderByAppointmentId(Long appointmentId) {
        Order order = orderRepository.findByAppointmentId(appointmentId);
        if (order == null) {
            throw new RuntimeException("Order not found for appointment ID: " + appointmentId);
        }
        return enrichOrderDTO(order);
    }
    public List<OrderDTO> getAllOrders() {
    // Giả sử bạn có repository orderRepository
    return orderRepository.findAll()
                          .stream()
                          .map(orderMapper::toDTO)
                          .toList();
}
    public OrderDTO assignTechnician(Long orderId, Long technicianId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setTechnicianId(technicianId);
        Order savedOrder = orderRepository.save(order);
        sendNotification(
            technicianId,
            "Phân công công việc mới 🛠️",
            "Bạn được phân công xử lý đơn hàng #" + orderId,
            "JOB_ASSIGNED"
        );
        return enrichOrderDTO(savedOrder);
    }

    public List<OrderDTO> getMyOrder(Long technicianId) {
        List<Order> orders = orderRepository.findByTechnicianId(technicianId);
        return orders.stream()
                .map(this::enrichOrderDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO updateManualOrderStatus(Long orderId, String status) {
        System.out.println("--------------------------------------------------");
        System.out.println("1. Nhận request update Order #" + orderId + " sang trạng thái: " + status);
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        System.out.println("2. Trạng thái hiện tại trong DB: " + order.getStatus());

        Order.OrderStatus newStatus;
        try {
            newStatus = Order.OrderStatus.valueOf(status.toUpperCase().trim());
        } catch (Exception e) {
            throw new RuntimeException("Status không hợp lệ: " + status);
        }
        
        // LOGIC DEBUG QUAN TRỌNG
        if (order.getStatus() == newStatus) {
            System.out.println("⚠️ CẢNH BÁO: Trạng thái mới giống trạng thái cũ. Logic bên trong sẽ bị bỏ qua!");
            // Nếu bạn muốn test lại tạo payment, hãy comment dòng if check này hoặc tạm thời cho chạy tiếp
        }

        if (order.getStatus() != newStatus) {
            System.out.println("3. Trạng thái thay đổi hợp lệ. Đang xử lý...");
            
            order.setStatus(newStatus);
            syncTechnicianStatus(order);
            
            if (newStatus == Order.OrderStatus.IN_PROGRESS && order.getStartDate() == null) {
                order.setStartDate(java.time.LocalDateTime.now());
                sendNotification(
                    order.getCustomerId(),
                    "Xe đang được sửa chữa 🚗",
                    "KTV đang kiểm tra và xử lý xe của bạn (Đơn #" + order.getId() + ")",
                    "ORDER_IN_PROGRESS"
                );
            }
            
            if (newStatus == Order.OrderStatus.COMPLETED) {
                System.out.println("4. Phát hiện trạng thái COMPLETED. Bắt đầu tính tiền...");
                
                order.setEndDate(java.time.LocalDateTime.now());
                
                double currentPartsCost = order.getTotalCost() != null ? order.getTotalCost() : 0.0;
                double baseServicePrice = getBasePriceByServiceType(order.getServiceType());
                double finalTotal = currentPartsCost + baseServicePrice;
                
                order.setTotalCost(finalTotal);
                System.out.println("   - Tổng tiền tính được: " + finalTotal);

                // Lưu Order TRƯỚC
                order = orderRepository.save(order);
                System.out.println("5. Đã lưu Order vào DB.");
                sendNotification(
                    order.getCustomerId(),
                    "Xe đã sẵn sàng! ✅",
                    "Quy trình bảo dưỡng hoàn tất. Vui lòng thanh toán và nhận xe.",
                    "ORDER_COMPLETED"
                );    
                // Gọi Payment
                try {
                    System.out.println("6. Đang gọi sang Payment Service (Port 8084)...");
                    createPaymentForOrder(order, finalTotal);
                    System.out.println("✅ 7. Gọi Payment Service thành công!");
                } catch (Exception e) {
                    System.err.println("❌ 7. LỖI KHI GỌI PAYMENT SERVICE:");
                    e.printStackTrace(); // In toàn bộ lỗi ra
                }
            }
        } else {
            System.out.println("--> Skip logic update vì trạng thái không đổi.");
        }

        Order saved = orderRepository.save(order);
        return enrichOrderDTO(saved);
    }

    // 🔹 Hàm phụ: Gọi Payment Client
    private void createPaymentForOrder(Order order, double amount) {
        PaymentDto paymentDto = PaymentDto.builder()
                .bookingID(order.getAppointmentId())
                .userID(order.getCustomerId()) // ID khách hàng (người trả tiền)
                .amount((int) amount)
                .invoiceNumber("INV-" + System.currentTimeMillis())
                .status("PENDING")
                .method("CASH")
                .build();

        
        paymentClient.createPayment("ROLE_STAFF", 0L, paymentDto);
        
        System.out.println("✅ Đã tạo Payment tự động cho Order #" + order.getId());
    }

    // 🔹 Hàm phụ: Lấy giá cơ bản của dịch vụ (Cấu hình cứng hoặc lấy từ DB)
    private double getBasePriceByServiceType(String serviceType) {
        return switch (serviceType) {
            case "MAINTENANCE" -> 500_000.0; // Phí nhân công bảo dưỡng
            case "BATTERY_REPLACEMENT" -> 2_000_000.0; // Phí nhân công thay pin
            case "ENGINE_REPAIR" -> 1_500_000.0;
            case "GENERAL_REPAIR" -> 300_000.0; // Phí kiểm tra chung
            default -> 0.0;
        };
    }

    public OrderDTO addPartToOrder(Long orderId, Long partId, int quantity, Long checklistItemId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderChecklistItem checklistItem = null;
        if (checklistItemId != null) {
            checklistItem = checklistRepository.findById(checklistItemId)
                    .orElseThrow(() -> new RuntimeException("Checklist item not found"));
        }

       
        OrderPart existingPart = orderPartRepository.findByOrderId(orderId).stream()
                .filter(p -> p.getPartId().equals(partId) && 
                       (checklistItemId == null || (p.getChecklistItem() != null && p.getChecklistItem().getId().equals(checklistItemId))))
                .findFirst()
                .orElse(null);

        // 2. Gọi sang PartService để trừ kho
        PartsDTO partInfo;
        try {
            partInfo = partClient.decreaseQuantity("ROLE_STAFF", partId, quantity);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi kho hoặc kết nối: " + e.getMessage());
        }
        
        double additionalCost = partInfo.getPrice() * quantity;

        if (existingPart != null) {
            // === TRƯỜNG HỢP ĐÃ CÓ: CẬP NHẬT SỐ LƯỢNG ===
            int newQuantity = existingPart.getQuantity() + quantity;
            existingPart.setQuantity(newQuantity);
            existingPart.setSubTotal(existingPart.getSubTotal() + additionalCost);
            orderPartRepository.save(existingPart);
        } else {
            // === TRƯỜNG HỢP CHƯA CÓ: TẠO MỚI ===
            OrderPart orderPart = OrderPart.builder()
                    .order(order)
                    .partId(partId)
                    .partName(partInfo.getPartName())
                    .partCode(partInfo.getPartCode())
                    .quantity(quantity)
                    .unitPrice(partInfo.getPrice())
                    .subTotal(additionalCost)
                    .checklistItem(checklistItem)
                    .build();
            orderPartRepository.save(orderPart);
        }

        // 3. Cập nhật tổng tiền Order
        double currentTotal = order.getTotalCost() != null ? order.getTotalCost() : 0.0;
        order.setTotalCost(currentTotal + additionalCost);
        
        Order savedOrder = orderRepository.save(order);
        return enrichOrderDTO(savedOrder);
    }

    public OrderChecklistItemDTO updateChecklistItemStatus(Long orderId, Long itemId, String status, String notes) {
        OrderChecklistItem item = checklistRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Checklist item not found"));

        if (!item.getOrder().getId().equals(orderId)) {
            throw new RuntimeException("Checklist item does not belong to this order");
        }

        OrderChecklistItem.ChecklistStatus newStatus = OrderChecklistItem.ChecklistStatus.valueOf(status);
        item.setStatus(newStatus);

        if (newStatus == OrderChecklistItem.ChecklistStatus.IN_PROGRESS && item.getStartedAt() == null) {
            item.setStartedAt(java.time.LocalDateTime.now());
        }
        if ((newStatus == OrderChecklistItem.ChecklistStatus.PASSED || newStatus == OrderChecklistItem.ChecklistStatus.FAILED) && item.getCompletedAt() == null) {
            item.setCompletedAt(java.time.LocalDateTime.now());
        }

        if (notes != null) {
            item.setNotes(notes);
        }
        checklistRepository.save(item);

        updateOrderStatusBasedOnChecklist(item.getOrder());

        // Map danh sách phụ tùng đi kèm (để trả về frontend luôn)
        List<OrderPartDTO> partsDto = null;
        if (item.getParts() != null) {
            partsDto = item.getParts().stream()
                    .map(p -> OrderPartDTO.builder()
                            .id(p.getId())
                            .partName(p.getPartName())
                            .partCode(p.getPartCode())
                            .quantity(p.getQuantity())
                            .unitPrice(p.getUnitPrice())
                            .subTotal(p.getSubTotal())
                            .build())
                    .collect(Collectors.toList());
        }

        return OrderChecklistItemDTO.builder()
                .id(item.getId())
                .description(item.getDescription())
                .status(item.getStatus().name())
                .notes(item.getNotes())
                .startedAt(item.getStartedAt())
                .completedAt(item.getCompletedAt())
                .parts(partsDto) // ✅ Gán danh sách phụ tùng vào DTO trả về
                .build();
    }

    private void updateOrderStatusBasedOnChecklist(Order order) {
        List<OrderChecklistItem> checklist = order.getChecklistItems();
        Order.OrderStatus oldStatus = order.getStatus();

        boolean allDone = checklist.stream()
                .allMatch(ci -> ci.getStatus() == OrderChecklistItem.ChecklistStatus.PASSED
                        || ci.getStatus() == OrderChecklistItem.ChecklistStatus.FAILED);

        boolean anyInProgress = checklist.stream()
                .anyMatch(ci -> ci.getStatus() == OrderChecklistItem.ChecklistStatus.IN_PROGRESS
                        || ci.getStatus() == OrderChecklistItem.ChecklistStatus.PASSED
                        || ci.getStatus() == OrderChecklistItem.ChecklistStatus.FAILED);

        // Sửa logic: Chỉ cập nhật IN_PROGRESS, không tự động COMPLETED
        if (anyInProgress && order.getStatus() == Order.OrderStatus.PENDING) {
            order.setStatus(Order.OrderStatus.IN_PROGRESS);
        }

        if (order.getStatus() != oldStatus) {
            syncTechnicianStatus(order);
        }
        orderRepository.save(order);
    }

    private void syncTechnicianStatus(Order order) {
        if (order.getTechnicianId() == null) return;

        try {
            if (order.getStatus() == Order.OrderStatus.IN_PROGRESS) {
                userClient.updateStaffStatus(order.getTechnicianId(), "ROLE_STAFF",  "BUSY");
            } else if (order.getStatus() == Order.OrderStatus.COMPLETED || order.getStatus() == Order.OrderStatus.CANCELED) {
                userClient.updateStaffStatus(order.getTechnicianId(), "ROLE_STAFF", "AVAILABLE");
            }
        } catch (Exception e) {
            System.err.println("Warning: Failed to update technician status: " + e.getMessage());
        }
    }

    private OrderDTO enrichOrderDTO(Order order) {
        OrderDTO dto = orderMapper.toDTO(order);
        try {
            dto.setCustomer(userClient.getUserById(order.getCustomerId(), 0L, "ROLE_STAFF"));    
            dto.setVehicle(vehicleClient.getVehicleById(order.getVehicleId(), "ROLE_STAFF", 0L));
        } catch (Exception e) {
            System.err.println("Warning: Could not fetch external details for Order " + order.getId() + ": " + e.getMessage());
        }
        return dto;
    }

    public List<OrderChecklistItemDTO> getChecklistByOrder(Long orderId) {
        List<OrderChecklistItem> checklist = checklistRepository.findByOrderId(orderId);

        return checklist.stream()
                .map(ci -> {
                    List<OrderPartDTO> partsDto = null;
                    if (ci.getParts() != null) {
                        partsDto = ci.getParts().stream()
                                .map(p -> OrderPartDTO.builder()
                                        .id(p.getId())
                                        .partName(p.getPartName())
                                        .partCode(p.getPartCode())
                                        .quantity(p.getQuantity())
                                        .unitPrice(p.getUnitPrice())
                                        .subTotal(p.getSubTotal())
                                        .build())
                                .collect(Collectors.toList());
                    }

                    return OrderChecklistItemDTO.builder()
                            .id(ci.getId())
                            .description(ci.getDescription())
                            .status(ci.getStatus().name())
                            .notes(ci.getNotes())
                            .startedAt(ci.getStartedAt())
                            .completedAt(ci.getCompletedAt())
                            .parts(partsDto)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<String> getDefaultChecklist(String serviceType) {
        if ("MAINTENANCE".equals(serviceType)) {
            return List.of("Kiểm tra hệ thống đèn chiếu sáng và tín hiệu", "Kiểm tra và đo độ mòn lốp xe", "Kiểm tra Lọc gió điều hòa", "Kiểm tra cần gạt mưa", "Kiểm tra mức nước làm mát Pin");
        } else if ("BATTERY_REPLACEMENT".equals(serviceType) || "BATTERY_CHECK".equals(serviceType)) {
            return List.of("Kiểm tra ngoại quan vỏ Pack Pin", "Kiểm tra tình trạng cổng sạc", "Kiểm tra điện áp bình 12V", "Scan lỗi hệ thống BMS");
        } else if ("BRAKE_SYSTEM_REPAIR".equals(serviceType)) {
            return List.of("Kiểm tra độ dày Má phanh trước", "Kiểm tra bề mặt Đĩa phanh", "Kiểm tra rò rỉ dầu phanh");
        } else if ("GENERAL_REPAIR".equals(serviceType)) {
            return List.of("Chẩn đoán lỗi qua OBD", "Kiểm tra gầm xe", "Kiểm tra hệ thống điều hòa");
        } else {
            return List.of("Kiểm tra tổng quát xe");
        }
    }

    @Transactional
    public void cancelOrderByAppointment(Long appointmentId) {
        Order order = orderRepository.findByAppointmentId(appointmentId);

        if (order != null && order.getStatus() == Order.OrderStatus.PENDING) {
            order.setStatus(Order.OrderStatus.CANCELED);
            syncTechnicianStatus(order);
            orderRepository.save(order);
            sendNotification(
                order.getCustomerId(),
                "Đơn hàng đã hủy ❌",
                "Đơn hàng #" + order.getId() + " đã bị hủy do lịch hẹn bị hủy.",
                "ORDER_CANCELED"
            );
        }
    }
    private void sendNotification(Long userId, String title, String message, String type) {
        try {
            NotificationEvent event = NotificationEvent.builder()
                    .userId(userId)
                    .title(title)
                    .message(message)
                    .type(type)
                    .timestamp(LocalDateTime.now())
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE_NAME,
                    RabbitMQConfig.ROUTING_KEY,
                    event
            );
            System.out.println("✅ Đã bắn Notification: " + type + " -> User " + userId);
        } catch (Exception e) {
            System.err.println("⚠️ Lỗi gửi RabbitMQ: " + e.getMessage());
        }
    }
}