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


   
    @Enumerated(EnumType.STRING)   
    @Column(nullable = false)
    private AppointmentStatus status;


    private String notes;


    private Long customerId;

    private Long staffId;
    private Long vehicleId;

    private Long serviceCenterId;
        
    public enum AppointmentStatus {
        PENDING,        // Chờ xử lý
        CONFIRMED,      // Đã xác nhận
        IN_PROGRESS,    // Đang thực hiện
        COMPLETED,      // Hoàn tất
        CANCELED        // Đã hủy
    }
    public enum ServiceType {
        MAINTENANCE,          // Bảo dưỡng
        BATTERY_REPLACEMENT,  // Thay pin
        ENGINE_REPAIR,        // Sửa động cơ
        GENERAL_REPAIR        // Sửa chữa chung
    }

}
