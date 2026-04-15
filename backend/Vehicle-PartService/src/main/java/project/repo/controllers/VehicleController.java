package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.VehicleDTO;
import project.repo.service.VehicleService;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    private void verifyOwnership(String role, Long currentUserId, Long targetUserId) {
        if (role != null && role.toUpperCase().contains("CUSTOMER") && !currentUserId.equals(targetUserId)) {
            throw new RuntimeException("Access denied: cannot access other customers' vehicles");
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'STAFF')")
    public VehicleDTO create(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody VehicleDTO dto) {

        if (role != null && role.toUpperCase().contains("CUSTOMER")) {
            dto.setCustomerId(userId);
        }
        return vehicleService.create(dto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public List<VehicleDTO> getAll() {
        return vehicleService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public VehicleDTO getById(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {

        VehicleDTO vehicle = vehicleService.getById(id);
        verifyOwnership(role, userId, vehicle.getCustomerId());
        return vehicle;
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public List<VehicleDTO> getByCustomer(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long customerId) {

        verifyOwnership(role, userId, customerId);
        return vehicleService.getByCustomer(customerId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public VehicleDTO update(
            @PathVariable Long id,
            @RequestBody VehicleDTO dto) {

        return vehicleService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        vehicleService.delete(id);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'STAFF')")
    public List<VehicleDTO> getMyVehicles(
            @RequestHeader("X-User-Id") Long userId) {

        return vehicleService.getByCustomer(userId);
    }
}