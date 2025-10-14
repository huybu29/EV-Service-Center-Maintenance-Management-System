package project.repo.dtos;

import lombok.Data;

@Data
public class ServiceChecklistDTO {
    private Long id;
    private Long serviceOrderId;
    private String batteryStatus;
    private String tirePressure;
    private String brakeCondition;
    private String lightSystem;
    private String bodyCondition;
    private String obdCodes;
    private String technicianNotes;
    private boolean preService; // true = trước, false = sau
}
