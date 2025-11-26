package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.OrderPartDTO;
import project.repo.dtos.OrderChecklistItemDTO;
import project.repo.dtos.OrderDTO;
import project.repo.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Hàm kiểm tra quyền hạn (Helper)
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    @GetMapping("/all")
    public List<OrderDTO> getAllOrders(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "ADMIN", "STAFF");
        return orderService.getAllOrders();
    }
    @PostMapping("/from-booking")
    public OrderDTO createOrderFromAppointment(@RequestBody OrderDTO orderDTO) {
        return orderService.createOrderFromAppointment(orderDTO);
    }

    // 2. Lấy chi tiết đơn hàng
    @GetMapping("/{orderId}")
    public OrderDTO getOrderWithChecklist(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long orderId) {
        checkRole(role, "STAFF", "ADMIN", "TECHNICIAN");
        return orderService.getOrderWithChecklist(orderId);
    }

    // 3. Cập nhật trạng thái đơn hàng (Bắt đầu / Hoàn thành)
    @PutMapping("/{orderId}/status")
    public OrderDTO updateOrderStatus(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long orderId,
            @RequestParam String status) { 
        checkRole(role, "STAFF", "ADMIN", "TECHNICIAN");
        return orderService.updateManualOrderStatus(orderId, status);
    }

    // 4. Lấy đơn hàng theo ID lịch hẹn
    @GetMapping("/by-appointment/{appointmentId}")
    public OrderDTO getOrderByAppointmentId(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long appointmentId) {
        checkRole(role, "STAFF", "ADMIN", "TECHNICIAN");
        return orderService.getOrderByAppointmentId(appointmentId);
    }

    // 5. Lấy danh sách công việc của tôi (Technician)
    @GetMapping("/my-orders")
    public List<OrderDTO> getMyOrders(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId) {
        checkRole(role, "TECHNICIAN");
        return orderService.getMyOrder(userId);
    }

    // 6. Lấy checklist của đơn hàng
    @GetMapping("/{orderId}/checklist")
    public List<OrderChecklistItemDTO> getChecklistByOrder(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long orderId) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN", "TECHNICIAN");
        return orderService.getChecklistByOrder(orderId);
    }

    // 7. Cập nhật trạng thái từng mục trong checklist
    @PutMapping("/{orderId}/checklist/{itemId}")
    public OrderChecklistItemDTO updateChecklistItemStatus(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long orderId,
            @PathVariable Long itemId,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        checkRole(role, "STAFF", "ADMIN", "TECHNICIAN");
        return orderService.updateChecklistItemStatus(orderId, itemId, status, notes);
    }

    // 8. Phân công kỹ thuật viên
    @PutMapping("/{orderId}/assign")
    public OrderDTO assignTechnician(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long orderId,
            @RequestParam Long technicianId) {
        checkRole(role, "STAFF", "ADMIN");
        return orderService.assignTechnician(orderId, technicianId);
    }

    // 9. Lấy checklist mẫu
    @GetMapping("/default-checklist")
    public List<String> getDefaultChecklist(
            @RequestHeader("X-User-Role") String role,
            @RequestParam String serviceType) {
        checkRole(role, "STAFF", "ADMIN", "TECHNICIAN");
        return orderService.getDefaultChecklist(serviceType);
    }

    // 10. Hủy đơn hàng khi hủy lịch
    @PutMapping("/cancel-by-booking/{appointmentId}")
    public void cancelOrderByAppointment(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long appointmentId) {
        checkRole(role, "STAFF", "ADMIN");
        orderService.cancelOrderByAppointment(appointmentId);
    }
    
    // 11. Thêm phụ tùng (Dùng RequestBody DTO thay vì RequestParam)
    @PostMapping("/{orderId}/parts")
    public OrderDTO addPart(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long orderId,
            @RequestBody OrderPartDTO request) { // <--- QUAN TRỌNG: Dùng @RequestBody

        checkRole(role, "TECHNICIAN", "STAFF", "ADMIN");
        
        return orderService.addPartToOrder(
            orderId, 
            request.getPartId(), 
            request.getQuantity(), 
            request.getChecklistItemId()
        );
    }
    
    // 12. Lịch sử sửa chữa của khách hàng (Placeholder)
    @GetMapping("/history")
    public List<OrderDTO> getCustomerHistory(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long customerId) {
        checkRole(role, "CUSTOMER");
        // return orderService.getOrdersByCustomerId(customerId);
        return List.of(); 
    }
}