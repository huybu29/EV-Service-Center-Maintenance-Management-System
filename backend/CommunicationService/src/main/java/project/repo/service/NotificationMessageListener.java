package project.repo.listener;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import project.repo.config.RabbitMQConfig;
import project.repo.dtos.NotificationDTO;
import project.repo.dtos.NotificationEvent;
import project.repo.service.NotificationService; // Giữ lại để lưu tracking vào MySQL (nếu cần)
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Component
@RequiredArgsConstructor
public class NotificationMessageListener {

    private final NotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleNotificationEvent(NotificationEvent event) {
        try {
            System.out.println("[RabbitMQ] Nhận sự kiện cho User " + event.getUserId() + ": " + event.getTitle());

        
            pushToFirestore(event);
         
            saveToDatabase(event);
            
          

        } catch (Exception e) {
            System.err.println("Lỗi xử lý thông báo Firebase: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void pushToFirestore(NotificationEvent event) throws InterruptedException, ExecutionException {
     
        Firestore db = FirestoreClient.getFirestore();

    
        Map<String, Object> data = new HashMap<>();
        data.put("userId", event.getUserId());
        data.put("title", event.getTitle());
        data.put("message", event.getMessage());
        data.put("type", event.getType());
        data.put("isRead", false);
        data.put("timestamp", com.google.cloud.firestore.FieldValue.serverTimestamp());

    
        db.collection("notifications")
          .add(data)
          .get(); 
        
        System.out.println("✅ Đã đẩy thông báo Real-time lên Firestore cho User: " + event.getUserId());
    }

    private NotificationDTO saveToDatabase(NotificationEvent event) {
        NotificationDTO dto = NotificationDTO.builder()
                .userId(event.getUserId())
                .title(event.getTitle())
                .message(event.getMessage())
                .type(event.getType())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
  
        NotificationDTO saved = notificationService.create(dto);
        System.out.println("✅ Đã lưu vào MySQL. ID: " + saved.getId());
        return saved;
    }
}