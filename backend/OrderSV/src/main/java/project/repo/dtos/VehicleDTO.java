package project.repo.dtos;

import lombok.Data;

@Data
public class VehicleDTO {
    private Long id;
    private String vin;
    private String model;
    private Integer mileageKm;
}


