package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.ServiceOrderDTO;
import project.repo.service.ServiceOrderService;

import java.util.List;

@RestController
@RequestMapping("/api/service-orders")
@RequiredArgsConstructor
public class ServiceOrderController {

    private final ServiceOrderService serviceOrderService;

    // 🔹 Helper kiểm tra role
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🟢 Tạo mới đơn dịch vụ (chỉ CUSTOMER)
    @PostMapping
    public ServiceOrderDTO create(
            @RequestHeader("X-User-Role") String role,
            @RequestBody ServiceOrderDTO dto) {

        return serviceOrderService.create(dto);
    }

    // 🟡 Lấy danh sách tất cả đơn dịch vụ (CUSTOMER, STAFF, ADMIN)
    @GetMapping
    public List<ServiceOrderDTO> getAll(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return serviceOrderService.findAll();
    }

    // 🔵 Lấy đơn theo ID (CUSTOMER, STAFF, ADMIN)
    @GetMapping("/{id}")
    public ServiceOrderDTO getById(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return serviceOrderService.findById(id);
    }

    // 🟠 Cập nhật đơn dịch vụ (CUSTOMER chỉ được sửa đơn của mình, STAFF & ADMIN)
    @PutMapping("/{id}")
    public ServiceOrderDTO update(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody ServiceOrderDTO dto) {

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role)) {
            // CUSTOMER chỉ được update đơn của chính mình
            ServiceOrderDTO existing = serviceOrderService.findById(id);
            if (!existing.getCustomerId().equals(userId)) {
                throw new RuntimeException("Access denied: cannot update others' orders");
            }
        } else {
            checkRole(role, "STAFF", "ADMIN");
        }

        return serviceOrderService.update(id, dto);
    }

    // 🔴 Xóa đơn dịch vụ (chỉ ADMIN)
    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "ADMIN");
        serviceOrderService.delete(id);
    }
}
