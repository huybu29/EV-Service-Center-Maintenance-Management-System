package project.repo.dtos;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ServiceOrderDTO {
    private Long id;
    private Long appointmentId;
    private Long vehicleId;
    private Long technicianId;
    private String status; // PENDING, IN_PROGRESS, COMPLETED
    private LocalDateTime createdAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private List<ServiceChecklistDTO> checklists;
}
