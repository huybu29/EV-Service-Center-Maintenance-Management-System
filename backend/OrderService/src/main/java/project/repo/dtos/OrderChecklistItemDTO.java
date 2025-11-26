package project.repo.dtos;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import project.repo.dtos.OrderPartDTO;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderChecklistItemDTO {

    private Long id;

    private String description;

    private String status; // ChecklistStatus

    private String notes;
    private List<OrderPartDTO> parts;
    private LocalDateTime startedAt;

    private LocalDateTime completedAt;
}
