package project.repo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

 
    @Column(nullable = false)
    private Long appointmentId;

    
    private Long technicianId;

  
    private Long vehicleId;
    
   
    @Column(nullable = false)
    private Double totalCost;

  
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;


    private String notes;

   
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String serviceType;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderChecklistItem> checklistItems;

    public enum OrderStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        APPROVED,
        CANCELED
    }
}
