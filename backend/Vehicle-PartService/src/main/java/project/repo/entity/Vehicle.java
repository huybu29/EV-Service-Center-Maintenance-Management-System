package project.repo.entity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String licensePlate;   // Biển số
    private String brand;          // Hãng xe
    private String model;          // Model xe
    private int manufactureYear;              // Năm sản xuất
    // Số km đã đi (dùng để nhắc bảo dưỡng)
    private Integer currentMileage;
    private String batteryType;
    private Long customerId;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public enum VehicleStatus {
    ACTIVE,          // Xe đang hoạt động bình thường
    IN_SERVICE,      // Xe đang được bảo dưỡng
    INACTIVE         // Xe không còn sử dụng
}
}
