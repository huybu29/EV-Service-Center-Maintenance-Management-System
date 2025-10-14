package project.repo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleDTO {
    private String licensePlate;
    private String brand;
    private String model;
    private int year;
    private Long customerId; // ID của Customer
}
