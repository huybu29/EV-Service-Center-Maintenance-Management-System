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
@Table(name = "parts")
public class Parts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long partId;

    @Column(unique = true, nullable = false, length = 50)
    private String partCode;

    @Column(nullable = false, length = 255)
    private String partName;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String unit;

    private Double price;
    
    private Integer quantity;
    @Enumerated(EnumType.STRING)
    private PartStatus status;
    @Column(name = "min_quantity")
    private Integer minQuantity;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String aiForecast;
    public enum PartStatus {
    ACTIVE,
    INACTIVE
}
}
