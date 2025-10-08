package project.repo.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import project.repo.entity.LowStockAlert.AlertStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LowStockAlertDTO {
    private Long alertId;
    private Long partId;
    private String partCode;
    private String partName;
    private Integer currentQuantity;
    private Integer minQuantity;
    private String alertMessage;
    private LocalDateTime alertDate;
    private AlertStatus status;
}
