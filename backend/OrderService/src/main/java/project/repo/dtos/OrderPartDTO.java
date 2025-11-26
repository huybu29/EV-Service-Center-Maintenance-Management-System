package project.repo.dtos;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderPartDTO {
    private Long id;
    private Long partId;
    private String partName;
    private String partCode;
    private Integer quantity;
    private Double unitPrice;
    private Double subTotal;
    private Long checklistItemId;
    
}