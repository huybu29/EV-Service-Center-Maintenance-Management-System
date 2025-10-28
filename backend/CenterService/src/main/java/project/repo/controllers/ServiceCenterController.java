package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.ServiceCenterDTO;
import project.repo.service.ServiceCenterService;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class ServiceCenterController {

    private final ServiceCenterService serviceCenterService;

    // 🔹 Helper kiểm tra role
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 1. Tạo mới trung tâm dịch vụ (chỉ ADMIN)
    @PostMapping
    public ServiceCenterDTO create(
            @RequestHeader("X-User-Role") String role,
            @RequestBody ServiceCenterDTO dto) {

        checkRole(role, "ADMIN");
        return serviceCenterService.create(dto);
    }

    // 🔹 2. Lấy danh sách tất cả trung tâm dịch vụ (mọi role)
    @GetMapping
    public List<ServiceCenterDTO> getAll(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return serviceCenterService.findAll();
    }

    // 🔹 3. Lấy trung tâm dịch vụ theo ID (mọi role)
    @GetMapping("/{id}")
    public ServiceCenterDTO getById(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return serviceCenterService.findById(id);
    }

    // 🔹 4. Cập nhật trung tâm dịch vụ (chỉ ADMIN)
    @PutMapping("/{id}")
    public ServiceCenterDTO update(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody ServiceCenterDTO dto) {

        checkRole(role, "ADMIN");
        return serviceCenterService.update(id, dto);
    }

    // 🔹 5. Xóa trung tâm dịch vụ (chỉ ADMIN)
    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "ADMIN");
        serviceCenterService.delete(id);
    }
}
