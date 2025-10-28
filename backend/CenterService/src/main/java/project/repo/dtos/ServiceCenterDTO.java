package project.repo.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCenterDTO {

    private Long id;
    private String name;        // Tên trung tâm
    private String address;     // Địa chỉ
    private String phone;       // Số điện thoại liên hệ

    private Double latitude;
    private Double longitude;

    private String status;      // ACTIVE, INACTIVE, MAINTENANCE
}
