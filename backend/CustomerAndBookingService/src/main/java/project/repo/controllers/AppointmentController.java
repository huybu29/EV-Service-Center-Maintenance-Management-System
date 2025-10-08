package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.repo.entity.Appointment;
import project.repo.service.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // Tạo lịch hẹn mới
    @PostMapping
    public ResponseEntity<Appointment> create(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.create(appointment));
    }

    // Lấy danh sách lịch hẹn
    @GetMapping
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(appointmentService.findAll());
    }

     // Lấy lịch hẹn theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getById(@PathVariable Long id) {
        return appointmentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy lịch hẹn theo khách hàng
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Appointment>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(appointmentService.findByCustomer(customerId));
    }

    // Lấy lịch hẹn theo xe
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<Appointment>> getByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(appointmentService.findByVehicle(vehicleId));
    }

    // Cập nhật lịch hẹn
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> update(@PathVariable Long id, @RequestBody Appointment appointment) {
        appointment.setId(id);
        return ResponseEntity.ok(appointmentService.update(appointment));
    }

    // Xóa lịch hẹn
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        appointmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
