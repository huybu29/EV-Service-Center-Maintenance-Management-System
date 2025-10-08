package project.repo.controllers;

import project.repo.entity.Vehicle;
import project.repo.service.VehicleService;
import project.repo.dto.VehicleDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    // Lấy danh sách tất cả xe
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    // Lấy xe theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy danh sách xe theo customerId
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Vehicle>> getVehiclesByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(vehicleService.getVehiclesByCustomerId(customerId));
    }

    // Thêm xe mới
    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody VehicleDTO vehicleDTO) {
        return ResponseEntity.ok(vehicleService.createVehicle(vehicleDTO));
    }

    // Cập nhật xe
    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody VehicleDTO updatedVehicleDTO) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, updatedVehicleDTO));
    }

    // Xóa xe
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
