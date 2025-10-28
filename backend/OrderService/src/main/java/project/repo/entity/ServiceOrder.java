package project.repo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "service_orders")
@Data
public class ServiceOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

  
    private Long appointmentId;

  
    private Long vehicleId;

    private Long customerId;
    private Long technicianId;
    private Long centerId;
    private String serviceType;   
    private String description; 
    @Enumerated(EnumType.STRING)
    private Status status; // PENDING, IN_PROGRESS, COMPLETED
    private LocalDateTime bookingDate;
    private LocalDateTime createdAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    
    private Double estimatedCost;   // Chi phí tạm tính
    private Double finalCost;       // Chi phí cuối cùng (sau khi hoàn tất)
    private String paymentStatus;
    public enum Status {
    CREATED,        // Đơn mới tạo
    CONFIRMED,      // Đã xác nhận bởi trung tâm
    IN_PROGRESS,    // Đang bảo dưỡng
    COMPLETED,      // Hoàn tất
    CANCELLED       // Đã hủy
}
}
