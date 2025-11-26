package project.repo.entity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "notifications")
public class Notification { 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId; // liên kết tới User

    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type; // SERVICE, PAYMENT, REMINDER,...

    private Long referenceId; // id liên kết (vd: service_order_id)

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Enumerated(EnumType.STRING)
    private Channel channel; // WEB, EMAIL, MOBILE, ALL

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime readAt;

   public enum NotificationType {
        // Nhóm Booking
        BOOKING_CREATED, 
        BOOKING_UPDATED,
        BOOKING_CONFIRMED,
        BOOKING_CANCELED,
        
        // Nhóm Order
        ORDER_CREATED,
        ORDER_IN_PROGRESS,
        ORDER_COMPLETED,
        ORDER_CANCELED,
        
        // Nhóm khác
        JOB_ASSIGNED,
        PAYMENT_CREATED,
        PAYMENT_SUCCESS,
        SYSTEM,
        INFO
    }
    public enum Channel {
        WEB,
        EMAIL,
        MOBILE,
        ALL
    }
}
