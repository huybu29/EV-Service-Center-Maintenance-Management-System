package project.repo.dtos;

import lombok.*;
import java.io.Serializable;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ServiceCenterDTO implements Serializable{

    private Long id;
    private String name;        // Tên trung tâm
    private String address;     // Địa chỉ
    private String phone;       // Số điện thoại liên hệ

    private Double latitude;
    private Double longitude;

    private String status;      // ACTIVE, INACTIVE, MAINTENANCE
}
