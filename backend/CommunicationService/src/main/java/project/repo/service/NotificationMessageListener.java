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
    // Bỏ SimpMessagingTemplate (WebSocket) và thay bằng Firebase
    
    // Lắng nghe hàng đợi: notification_queue
    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleNotificationEvent(NotificationEvent event) {
        try {
            System.out.println("📩 [RabbitMQ] Nhận sự kiện cho User " + event.getUserId() + ": " + event.getTitle());

            // 1. Ghi (Write) lên Firestore để Frontend Realtime Listener nhận được ngay lập tức
            pushToFirestore(event);
            
            // 2. Lưu vào Database SQL (Tracking lịch sử)
            saveToDatabase(event);
            
            // 3. (Tùy chọn) Gửi Push Notification (FCM) nếu cần
            // sendFCMNotification(event);

        } catch (Exception e) {
            System.err.println("❌ Lỗi xử lý thông báo Firebase: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // -------------------------------------------------------------
    // LOGIC: LƯU VÀO FIRESTORE (DÙNG CHO REALTIME CHUÔNG & CHAT)
    // -------------------------------------------------------------
    private void pushToFirestore(NotificationEvent event) throws InterruptedException, ExecutionException {
        // Lấy Firestore Instance
        Firestore db = FirestoreClient.getFirestore();

        // Chuẩn bị Data Map
        Map<String, Object> data = new HashMap<>();
        data.put("userId", event.getUserId());
        data.put("title", event.getTitle());
        data.put("message", event.getMessage());
        data.put("type", event.getType());
        data.put("isRead", false);
        data.put("timestamp", com.google.cloud.firestore.FieldValue.serverTimestamp());

        // Lưu vào Collection "notifications"
        db.collection("notifications")
          .add(data)
          .get(); 
        
        System.out.println("✅ Đã đẩy thông báo Real-time lên Firestore cho User: " + event.getUserId());
    }

    // -------------------------------------------------------------
    // LOGIC: LƯU VÀO MYSQL (DÙNG CHO LỊCH SỬ)
    // -------------------------------------------------------------
    private NotificationDTO saveToDatabase(NotificationEvent event) {
        NotificationDTO dto = NotificationDTO.builder()
                .userId(event.getUserId())
                .title(event.getTitle())
                .message(event.getMessage())
                .type(event.getType())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        // Giả sử NotificationService.create(dto) gọi Repository lưu vào MySQL
        NotificationDTO saved = notificationService.create(dto);
        System.out.println("✅ Đã lưu vào MySQL. ID: " + saved.getId());
        return saved;
    }
}