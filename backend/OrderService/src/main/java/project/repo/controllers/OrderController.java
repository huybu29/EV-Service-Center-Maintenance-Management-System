package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.OrderDTO;
import project.repo.dtos.OrderChecklistItemDTO;
import project.repo.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 🔹 Helper kiểm tra quyền (role)
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // ✅ 1. API cho BookingService gọi sang để tạo Order khi appointment CONFIRMED
    @PostMapping("/from-appointment")
    public OrderDTO createOrderFromAppointment(@RequestBody OrderDTO orderDTO) {
        return orderService.createOrderFromAppointment(orderDTO);
    }

    // ✅ 2. Lấy thông tin Order kèm checklist (STAFF, ADMIN)
    @GetMapping("/{orderId}")
    public OrderDTO getOrderWithChecklist(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long orderId) {

        checkRole(role, "STAFF", "ADMIN");
        return orderService.getOrderWithChecklist(orderId);
    }

    // ✅ 3. Lấy toàn bộ checklist theo Order ID (STAFF, ADMIN, CUSTOMER xem được)
    @GetMapping("/{orderId}/checklist")
    public List<OrderChecklistItemDTO> getChecklistByOrder(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long orderId) {

        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return orderService.getChecklistByOrder(orderId);
    }

    // ✅ 4. Cập nhật trạng thái checklist item (STAFF thực hiện)
    @PutMapping("/{orderId}/checklist/{itemId}")
    public OrderChecklistItemDTO updateChecklistItemStatus(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long orderId,
            @PathVariable Long itemId,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {

        checkRole(role, "STAFF", "ADMIN");
        return orderService.updateChecklistItemStatus(orderId, itemId, status, notes);
    }

    // ✅ 5. (Tuỳ chọn) Lấy checklist mặc định theo serviceType
    @GetMapping("/default-checklist")
    public List<String> getDefaultChecklist(
            @RequestHeader("X-User-Role") String role,
            @RequestParam String serviceType) {

        checkRole(role, "STAFF", "ADMIN");
        return orderService.getDefaultChecklist(serviceType);
    }
}
