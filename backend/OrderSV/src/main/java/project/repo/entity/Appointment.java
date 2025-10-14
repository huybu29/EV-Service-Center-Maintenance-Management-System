package project.repo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId; // refer to customer table in real app
    private Long vehicleId;
    private String serviceType;

    private LocalDateTime appointmentTime;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        SCHEDULED, CONFIRMED, IN_SERVICE, CANCELLED
    }
}
