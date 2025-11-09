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

    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    @PostMapping("/from-appointment")
    public OrderDTO createOrderFromAppointment(@RequestBody OrderDTO orderDTO) {
        return orderService.createOrderFromAppointment(orderDTO);
    }

   
    @GetMapping("/{orderId}")
    public OrderDTO getOrderWithChecklist(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long orderId) {

        checkRole(role, "STAFF", "ADMIN");
        return orderService.getOrderWithChecklist(orderId);
    }

    @GetMapping("/{orderId}/checklist")
    public List<OrderChecklistItemDTO> getChecklistByOrder(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long orderId) {

        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return orderService.getChecklistByOrder(orderId);
    }

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

    @GetMapping("/default-checklist")
    public List<String> getDefaultChecklist(
            @RequestHeader("X-User-Role") String role,
            @RequestParam String serviceType) {

        checkRole(role, "STAFF", "ADMIN");
        return orderService.getDefaultChecklist(serviceType);
    }
    @PutMapping("/cancel-by-appointment/{appointmentId}")
    public void cancelOrderByAppointment(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long appointmentId) {

        orderService.cancelOrderByAppointment(appointmentId);
    }
}