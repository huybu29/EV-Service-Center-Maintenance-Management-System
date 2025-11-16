package project.repo.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.repo.entity.Notification.Channel;
import project.repo.entity.Notification.NotificationType;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class NotificationDTO {

    private Long id;
    private Long userId;
    private String title;
    private String message;
    private String type;       // dạng String để dễ serialize (vd: "SERVICE")
    private String channel;    // "WEB", "EMAIL", ...
    private Long referenceId;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}