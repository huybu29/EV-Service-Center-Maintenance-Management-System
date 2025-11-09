package project.repo.dtos;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long id;

    private Long appointmentId;

    private Long technicianId;

    private Long vehicleId;

    private Double totalCost;

    private String status; // OrderStatus

    private String notes;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
  private String serviceType;
    private List<OrderChecklistItemDTO> checklistItems;
}
