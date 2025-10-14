package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.repo.entity.ServiceCenter;
import project.repo.service.ServiceCenterService;

import java.util.List;

@RestController
@RequestMapping("/api/service-centers")
@RequiredArgsConstructor
public class ServiceCenterController {

    private final ServiceCenterService serviceCenterService;

    // Tạo trung tâm dịch vụ
    @PostMapping
    public ResponseEntity<ServiceCenter> create(@RequestBody ServiceCenter serviceCenter) {
        return ResponseEntity.ok(serviceCenterService.create(serviceCenter));
    }

    // Lấy danh sách trung tâm dịch vụ
    @GetMapping
    public ResponseEntity<List<ServiceCenter>> getAll() {
        return ResponseEntity.ok(serviceCenterService.findAll());
    }

    // Lấy trung tâm dịch vụ theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ServiceCenter> getById(@PathVariable Long id) {
        return serviceCenterService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Cập nhật trung tâm dịch vụ
    @PutMapping("/{id}")
    public ResponseEntity<ServiceCenter> update(@PathVariable Long id, @RequestBody ServiceCenter updated) {
        return ResponseEntity.ok(serviceCenterService.update(id, updated));
    }

    // Xóa trung tâm dịch vụ
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceCenterService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
