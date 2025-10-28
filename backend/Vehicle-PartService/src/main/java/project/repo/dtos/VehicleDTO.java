package project.repo.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.repo.entity.Vehicle.VehicleStatus;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleDTO {

    private Long id;
    private String licensePlate;      // Biển số xe
    private String brand;             // Hãng xe
    private String model;             // Dòng xe
    private int manufactureYear;      // Năm sản xuất
    private Integer currentMileage;   // Số km đã đi
    private String batteryType;       // Loại pin
    private Long customerId;          // ID khách hàng sở hữu
    private VehicleStatus status;     // Trạng thái xe
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
