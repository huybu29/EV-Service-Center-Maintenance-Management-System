package project.repo.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleDTO {

    private Long id;
    private String brand;             // Hãng xe
    private String model;             // Dòng xe
    private int manufactureYear;      // Năm sản xuất
    private Integer currentMileage;   // Số km đã đi
    private String batteryType;       // Loại pin
    private Long customerId;          // ID khách hàng sở hữu
    private String status;     // Trạng thái xe
    private String vin;              // Số VIN
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
