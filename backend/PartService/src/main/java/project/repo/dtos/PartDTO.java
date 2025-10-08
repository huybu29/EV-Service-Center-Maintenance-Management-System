package project.repo.dtos;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartDTO {
    private Long partId;
    private String partCode;
    private String partName;
    private String category;
    private String description;
    private String unit;
    private Double price;
    private Integer quantity;
    private Integer minQuantity;
    private LocalDateTime updated;
}