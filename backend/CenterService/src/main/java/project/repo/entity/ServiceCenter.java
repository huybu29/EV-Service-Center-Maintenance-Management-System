package project.repo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "service_centers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // Tên trung tâm
    private String address;     // Địa chỉ
    private String phone;       // Số điện thoại liên hệ

    private Double latitude;
    private Double longitude;
     private StationStatus status;
    public enum StationStatus {
    ACTIVE, INACTIVE, MAINTENANCE
}
}