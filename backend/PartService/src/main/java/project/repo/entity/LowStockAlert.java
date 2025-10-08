package project.repo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "low_stock_alerts")
public class LowStockAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertId;

    @ManyToOne
    @JoinColumn(name = "part_id", nullable = false)
    private Parts part;

    private Integer currentQuantity;

    private Integer minQuantity;

    @Column(columnDefinition = "TEXT")
    private String alertMessage;

    private LocalDateTime alertDate;

    @Enumerated(EnumType.STRING)
    private AlertStatus status;

    public enum AlertStatus {
        UNRESOLVED,
        RESOLVED
    }
}
