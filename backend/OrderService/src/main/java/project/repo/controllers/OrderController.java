package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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

  
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @GetMapping("/all")
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PostMapping("/from-booking")
    public OrderDTO createOrderFromAppointment(@RequestBody OrderDTO orderDTO) {
        return orderService.createOrderFromAppointment(orderDTO);
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    @GetMapping("/{orderId}")
    public OrderDTO getOrderWithChecklist(@PathVariable Long orderId) {
        return orderService.getOrderWithChecklist(orderId);
    }

    
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    @PutMapping("/{orderId}/status")
    public OrderDTO updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) { 
        return orderService.updateManualOrderStatus(orderId, status);
    }

   
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    @GetMapping("/by-appointment/{appointmentId}")
    public OrderDTO getOrderByAppointmentId(@PathVariable Long appointmentId) {
        return orderService.getOrderByAppointmentId(appointmentId);
    }

    @PreAuthorize("hasRole('TECHNICIAN')")
    @GetMapping("/my-orders")
    public List<OrderDTO> getMyOrders(@RequestHeader("X-User-Id") Long userId) {
        return orderService.getMyOrder(userId);
    }

    
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    @GetMapping("/{orderId}/checklist")
    public List<OrderChecklistItemDTO> getChecklistByOrder(@PathVariable Long orderId) {
        return orderService.getChecklistByOrder(orderId);
    }

    
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    @PutMapping("/{orderId}/checklist/{itemId}")
    public OrderChecklistItemDTO updateChecklistItemStatus(
            @PathVariable Long orderId,
            @PathVariable Long itemId,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        return orderService.updateChecklistItemStatus(orderId, itemId, status, notes);
    }

    
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @PutMapping("/{orderId}/assign")
    public OrderDTO assignTechnician(
            @PathVariable Long orderId,
            @RequestParam Long technicianId) {
        return orderService.assignTechnician(orderId, technicianId);
    }

  
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    @GetMapping("/default-checklist")
    public List<String> getDefaultChecklist(@RequestParam String serviceType) {
        return orderService.getDefaultChecklist(serviceType);
    }

  
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @PutMapping("/cancel-by-booking/{appointmentId}")
    public void cancelOrderByAppointment(@PathVariable Long appointmentId) {
        orderService.cancelOrderByAppointment(appointmentId);
    }
    
    
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'STAFF', 'ADMIN')")
    @PostMapping("/{orderId}/parts")
    public OrderDTO addPart(
            @PathVariable Long orderId,
            @RequestBody OrderPartDTO request) { 
        return orderService.addPartToOrder(
            orderId, 
            request.getPartId(), 
            request.getQuantity(), 
            request.getChecklistItemId()
        );
    }
    
    // 12. Lịch sử sửa chữa của khách hàng
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/history")
    public List<OrderDTO> getCustomerHistory(@RequestHeader("X-User-Id") Long customerId) {
        // return orderService.getOrdersByCustomerId(customerId);
        return List.of(); 
    }
}