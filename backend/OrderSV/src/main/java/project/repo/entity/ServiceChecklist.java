package project.repo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "service_checklists")
@Data
public class ServiceChecklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String batteryStatus;
    private String tirePressure;
    private String brakeCondition;
    private String lightSystem;
    private String bodyCondition;
    private String obdCodes;
    private String technicianNotes;

    private boolean preService; // true = trước, false = sau

    @ManyToOne
    @JoinColumn(name = "service_order_id")
    private ServiceOrder serviceOrder;
}
