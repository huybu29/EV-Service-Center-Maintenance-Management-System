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

    // 1 trung tâm có thể có nhiều lịch hẹn
    @OneToMany(mappedBy = "serviceCenter", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "center-appointments")
    private List<Appointment> appointments;
}
