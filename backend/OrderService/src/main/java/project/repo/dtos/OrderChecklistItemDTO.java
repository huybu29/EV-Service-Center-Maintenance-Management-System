package project.repo.dtos;

import lombok.*;

import java.time.LocalDateTime;

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

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;
}
