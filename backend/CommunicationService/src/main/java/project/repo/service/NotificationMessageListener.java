package project.repo.service; // (Đổi package cho đúng)

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import project.repo.config.RabbitMQConfig; // Import config
import project.repo.dtos.BookingCreatedEvent; // Import DTO
import project.repo.dtos.NotificationDTO;
import project.repo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import project.repo.service.NotificationService;
@Component
@RequiredArgsConstructor
public class NotificationMessageListener {
    private final NotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleBookingCreatedEvent(BookingCreatedEvent event) {
        
        System.out.println("✅ NotificationService (Nhận): Đã nhận sự kiện 'booking.created'!");

        // 2. Tạo NotificationDTO với các trường đầy đủ
        NotificationDTO notificationDto = NotificationDTO.builder()
            .userId(event.customerId())
            .title("Đặt lịch thành công!")
            .message(String.format(
                "Lịch hẹn #%d của bạn đã được xác nhận. Số tiền dự kiến: %.0f VNĐ.",
                event.bookingId(),
                event.estimatedAmount()
            ))
            .type("SERVICE") // Loại thông báo: Dịch vụ
            .channel("WEB") // Kênh thông báo: Hiển thị trên web/app
            .referenceId(event.bookingId()) // ID tham chiếu đến Booking
            .build();
        
        // (Trường isRead và createdAt sẽ được service 'create' xử lý)

        // 3. Gọi hàm 'create(dto)'
        try {
            notificationService.create(notificationDto); 
            System.out.println("NotificationService: Đã lưu thông báo mới vào CSDL cho UserID: " + event.customerId());
        } catch (Exception e) {
            System.err.println("Lỗi khi lưu thông báo: " + e.getMessage());
        }
        
        System.out.println("✅ NotificationService (Nhận): Đã xử lý xong.");
    }
}