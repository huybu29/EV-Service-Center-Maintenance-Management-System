package project.repo.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ServiceOrderDTO {

    private Long id;
    private Long appointmentId;
    private Long vehicleId;
    private Long technicianId;
    private Long centerId;
    private Long customerId;
    private String serviceType;
    private String description;
    private String status;  // dùng String thay vì Enum để truyền JSON dễ hơn

    private LocalDateTime bookingDate;
    private LocalDateTime createdAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    private Double estimatedCost;
    private Double finalCost;
    private String paymentStatus;
}
