package project.repo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.ServiceChecklistDTO;
import project.repo.dtos.ServiceOrderDTO;
import project.repo.service.ServiceOrderService;

import java.util.List;

@RestController
@RequestMapping("/api/service-orders")
public class ServiceOrderController {

    @Autowired
    private ServiceOrderService serviceOrderService;

    /** Tạo phiếu từ appointmentId (có thể null) và gán technicianId (có thể null) */
    @PostMapping("/from-appointment")
    public ResponseEntity<ServiceOrderDTO> createFromAppointment(
            @RequestParam(required = false) Long appointmentId,
            @RequestParam(required = false) Long technicianId) {
        return ResponseEntity.ok(serviceOrderService.createFromAppointment(appointmentId, technicianId));
    }

    /** Cập nhật trạng thái (PENDING, IN_PROGRESS, COMPLETED) */
    @PutMapping("/{id}/status")
    public ResponseEntity<ServiceOrderDTO> updateStatus(
            @PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(serviceOrderService.updateStatus(id, status));
    }

    /** Thêm checklist (pre/post) */
    @PostMapping("/{id}/checklist")
    public ResponseEntity<ServiceChecklistDTO> addChecklist(
            @PathVariable Long id, @RequestBody ServiceChecklistDTO dto) {
        return ResponseEntity.ok(serviceOrderService.addChecklist(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<ServiceOrderDTO>> listAll() {
        return ResponseEntity.ok(serviceOrderService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOrderDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(serviceOrderService.get(id));
    }
}
