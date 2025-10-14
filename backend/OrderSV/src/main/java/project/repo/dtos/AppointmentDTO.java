package project.repo.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private Long id;
    private Long customerId;
    private Long vehicleId;
    private String serviceType;
    private LocalDateTime appointmentTime;
    private String status; // SCHEDULED, CONFIRMED, IN_SERVICE, CANCELLED
}
