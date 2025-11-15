package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.OrderDTO;
import project.repo.dtos.OrderChecklistItemDTO;
import project.repo.entity.Order;
import project.repo.entity.OrderChecklistItem;
import project.repo.mapper.OrderMapper;
import project.repo.repository.OrderRepository;
import project.repo.repository.OrderChecklistItemRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderChecklistItemRepository checklistRepository;
    private final OrderMapper orderMapper;

  
    public OrderDTO createOrderFromAppointment(OrderDTO dto) {
        // Tạo Order entity
        Order order = Order.builder()
                .appointmentId(dto.getAppointmentId())
                .technicianId(dto.getTechnicianId())
                .vehicleId(dto.getVehicleId())
                .status(Order.OrderStatus.PENDING)
                .build();

        List<String> defaultChecklist = getDefaultChecklist(dto.getServiceType());
        List<OrderChecklistItem> checklist = defaultChecklist.stream()
                .map(task -> OrderChecklistItem.builder()
                        .order(order)
                        .description(task)
                        .status(OrderChecklistItem.ChecklistStatus.PENDING)
                        .build())
                .toList();

        order.setChecklistItems(checklist);

        Order saved = orderRepository.save(order);
        return orderMapper.toDTO(saved);
    }

  
    public OrderDTO getOrderWithChecklist(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return orderMapper.toDTO(order);
    }


    public OrderChecklistItemDTO updateChecklistItemStatus(Long orderId, Long itemId, String status, String notes) {
    OrderChecklistItem item = checklistRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Checklist item not found"));

    if (!item.getOrder().getId().equals(orderId)) {
        throw new RuntimeException("Checklist item does not belong to this order");
    }

  
    item.setStatus(OrderChecklistItem.ChecklistStatus.valueOf(status));
    if (notes != null) {
        item.setNotes(notes);
    }
    checklistRepository.save(item);

    Order order = item.getOrder();
    List<OrderChecklistItem> checklist = order.getChecklistItems();

    boolean allPassed = checklist.stream()
            .allMatch(ci -> ci.getStatus() == OrderChecklistItem.ChecklistStatus.PASSED);

    boolean anyInProgress = checklist.stream()
            .anyMatch(ci -> ci.getStatus() == OrderChecklistItem.ChecklistStatus.IN_PROGRESS);

    boolean anyFailed = checklist.stream()
            .anyMatch(ci -> ci.getStatus() == OrderChecklistItem.ChecklistStatus.FAILED);


    if (allPassed) {
        
        order.setStatus(Order.OrderStatus.COMPLETED);
    } else if (anyInProgress) {
        order.setStatus(Order.OrderStatus.IN_PROGRESS);
    } else if (anyFailed) {
        order.setStatus(Order.OrderStatus.PENDING);
    }

    orderRepository.save(order);

    return OrderChecklistItemDTO.builder()
            .id(item.getId())
            .description(item.getDescription())
            .status(item.getStatus().name())
            .notes(item.getNotes())
            .startedAt(item.getStartedAt())
            .completedAt(item.getCompletedAt())
            .build();
}

    public List<OrderChecklistItemDTO> getChecklistByOrder(Long orderId) {
        List<OrderChecklistItem> checklist = checklistRepository.findByOrderId(orderId);
        return checklist.stream()
                .map(ci -> OrderChecklistItemDTO.builder()
                        .id(ci.getId())
                        .description(ci.getDescription())
                        .status(ci.getStatus().name())
                        .notes(ci.getNotes())
                        .startedAt(ci.getStartedAt())
                        .completedAt(ci.getCompletedAt())
                        .build())
                .collect(Collectors.toList());
    }

 
    public List<String> getDefaultChecklist(String serviceType) {
        return switch (serviceType) {
            case "MAINTENANCE" -> List.of("Kiểm tra pin", "Thay dầu", "Kiểm tra hệ thống phanh");
            case "BATTERY_REPLACEMENT" -> List.of("Tháo pin cũ", "Lắp pin mới", "Kiểm tra kết nối điện");
            case "ENGINE_REPAIR" -> List.of("Kiểm tra động cơ", "Thay linh kiện hỏng", "Chạy thử xe");
            case "GENERAL_REPAIR" -> List.of("Chẩn đoán lỗi", "Sửa chữa chi tiết", "Kiểm tra tổng thể");
            default -> List.of("Kiểm tra chung");
        };
    }
    private boolean isValidStatusTransition(Order.OrderStatus current, Order.OrderStatus next) {
    if (current == next) return true;

    return switch (current) {
        case PENDING -> next == Order.OrderStatus.IN_PROGRESS;
        case IN_PROGRESS -> next == Order.OrderStatus.COMPLETED;
        case COMPLETED -> next == Order.OrderStatus.APPROVED;
        default -> false; // APPROVED không thể chuyển tiếp
    };
}
    @Transactional
    public void cancelOrderByAppointment(Long appointmentId) {
        Order order = orderRepository.findByAppointmentId(appointmentId);

        if (order != null && order.getStatus() == Order.OrderStatus.PENDING) {
            order.setStatus(Order.OrderStatus.CANCELED);
            orderRepository.save(order);
            System.out.println("✅ Order đã được tự động hủy vì booking bị hủy.");
        }
}
}
