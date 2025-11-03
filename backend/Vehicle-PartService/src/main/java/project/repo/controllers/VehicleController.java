package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.VehicleDTO;
import project.repo.service.VehicleService;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    // 🔹 Helper kiểm tra role
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 Tạo xe mới (chỉ ADMIN)
    @PostMapping
    public VehicleDTO create(
            @RequestHeader("X-User-Role") String role,
             @RequestHeader("X-User-Id") Long userId,
            @RequestBody VehicleDTO dto) {

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role)) {
            // Nếu là khách hàng → tự động gán ID người dùng vào customerId
            dto.setCustomerId(userId);
        } else {
            // ADMIN hoặc STAFF thì giữ nguyên (cho phép chỉ định customerId)
            checkRole(role, "ADMIN", "STAFF");
        }
        return vehicleService.create(dto);
    }

    // 🔹 Lấy tất cả xe (STAFF, ADMIN)
    @GetMapping
    public List<VehicleDTO> getAll(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "STAFF", "ADMIN");
        return vehicleService.getAll();
    }


    
    // 🔹 Lấy tất cả xe của trung tâm (chỉ STAFF)
    @GetMapping("/staff")
    public List<VehicleDTO> getStaffVehicles(
        @RequestHeader("X-User-Role") String role,
        @RequestHeader("X-User-CenterId") Long centerId) {

    checkRole(role, "STAFF");
    return vehicleService.getByCenter(centerId);
    }





    // 🔹 Lấy xe theo ID (STAFF, ADMIN, CUSTOMER – CUSTOMER chỉ xem xe của mình)
    @GetMapping("/{id}")
    public List<VehicleDTO> getById(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role)) {
            List<VehicleDTO> vehicles = vehicleService.getById(id);
            if (vehicles.stream().anyMatch(v -> !v.getCustomerId().equals(userId))) {
                throw new RuntimeException("Access denied: cannot view other customers' vehicles");
            }
            return vehicles;
        } else {
            checkRole(role, "STAFF", "ADMIN");
            return vehicleService.getById(id);
        }
    }

    // 🔹 Lấy xe theo customerId (CUSTOMER chỉ xem xe của chính mình)
    @GetMapping("/customer/{customerId}")
    public List<VehicleDTO> getByCustomer(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long customerId) {

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role) && !userId.equals(customerId)) {
            throw new RuntimeException("Access denied: cannot view other customers' vehicles");
        } else {
            checkRole(role, "STAFF", "ADMIN", "CUSTOMER");
        }

        return vehicleService.getByCustomer(customerId);
    }

    // 🔹 Cập nhật xe (STAFF, ADMIN)
    @PutMapping("/{id}")
    public VehicleDTO update(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody VehicleDTO dto) {

        checkRole(role, "STAFF", "ADMIN");
        return vehicleService.update(id, dto);
    }

    // 🔹 Xóa xe (chỉ ADMIN)
    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "ADMIN");
        vehicleService.delete(id);
    }
    @GetMapping("/me")
    public List<VehicleDTO> getMyVehicles(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {

        checkRole(role, "CUSTOMER", "ADMIN", "STAFF");
        return vehicleService.getByCustomer(userId);
    }
}
