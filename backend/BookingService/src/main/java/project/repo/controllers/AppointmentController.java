package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.AppointmentDTO;
import project.repo.service.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    private void verifyCustomerOwnership(String role, Long currentUserId, Long targetUserId) {
        if (role != null && role.toUpperCase().contains("CUSTOMER") && !currentUserId.equals(targetUserId)) {
            throw new RuntimeException("Access denied: cannot access others' appointments");
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public AppointmentDTO createAppointment(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody AppointmentDTO dto) {

        dto.setCustomerId(userId);
        return appointmentService.create(dto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentService.getAllAppointment();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public AppointmentDTO getAppointmentById(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {

        AppointmentDTO appointment = appointmentService.getAppointmentById(id);
        
        if (appointment == null) {
            throw new RuntimeException("Appointment not found");
        }

        verifyCustomerOwnership(role, userId, appointment.getCustomerId());
        return appointment;
    }

    @GetMapping("/vehicle/{vehicleId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public List<AppointmentDTO> getAppointmentsByVehicle(
            @PathVariable Long vehicleId) {

        return appointmentService.getAppointmentByVehicle(vehicleId);
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public List<AppointmentDTO> getAppointmentsByCustomer(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long customerId) {

        verifyCustomerOwnership(role, userId, customerId);
        return appointmentService.getAppointmentByCustomer(customerId);
    }

    

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public AppointmentDTO updateAppointment(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestBody AppointmentDTO dto) {

        AppointmentDTO existing = appointmentService.getAppointmentById(id);
        
        if (existing == null) {
            throw new RuntimeException("Appointment not found");
        }

        verifyCustomerOwnership(role, userId, existing.getCustomerId());

        dto.setId(id);
        dto.setCustomerId(existing.getCustomerId());
        return appointmentService.updateAppointment(dto);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'TECHNICIAN')")
    public AppointmentDTO updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody String status) {
            
        return appointmentService.updateAppointmentStatus(id, status);
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('STAFF')")
    public AppointmentDTO acceptAppointment(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long staffId) {

        return appointmentService.acceptBooking(id, staffId);
    }

    @GetMapping("/service-center/my-station")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public List<AppointmentDTO> getAppointmentsByServiceCenter(
            @RequestHeader("X-User-Station-Id") Long stationId) {
                    
        return appointmentService.getAppointmentByServiceCenter(stationId);
    }
    
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public AppointmentDTO cancelAppointment(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {

        return appointmentService.cancelBooking(id, userId, role);
    }
}