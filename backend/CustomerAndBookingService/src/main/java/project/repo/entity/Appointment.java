package project.repo.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ngày giờ hẹn
    @Column(nullable = false)
    private LocalDateTime appointmentDate;

    // Loại dịch vụ (enum)
    @Enumerated(EnumType.STRING)   // Lưu enum dưới dạng text (MAINTENANCE, ENGINE_REPAIR,...)
    @Column(nullable = false)
    private ServiceType serviceType;


    // Trạng thái: chờ, đang làm, hoàn tất, hủy
    @Enumerated(EnumType.STRING)   // Lưu dưới dạng text (PENDING, COMPLETED,...)
    @Column(nullable = false)
    private AppointmentStatus status;


    // Ghi chú thêm (nếu khách có yêu cầu đặc biệt)
    private String notes;

    // Quan hệ: 1 khách hàng có nhiều lịch hẹn
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonBackReference(value = "customer-appointments")
    private Customer customer;

    // Quan hệ: 1 xe có nhiều lịch hẹn
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    @JsonBackReference(value = "vehicle-appointments")
    private Vehicle vehicle;

     // Thêm: 1 trung tâm dịch vụ có nhiều lịch hẹn
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_center_id", nullable = false)
    @JsonBackReference(value = "center-appointments")
    private ServiceCenter serviceCenter;
}
