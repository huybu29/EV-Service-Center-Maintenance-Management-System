package project.repo.dtos;

import lombok.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent implements Serializable {
    private Long recipientId;    
    private String recipientEmail;
    private String title;        
    private String message;      
    private String type;          
    private String referenceLink;
    private LocalDateTime timestamp;
}