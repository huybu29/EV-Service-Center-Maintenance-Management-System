package project.repo.dtos; // (Đổi package cho đúng)

/**
 * DTO (Event) này sẽ được gửi qua RabbitMQ.
 * PaymentService và ReportingService sẽ "lắng nghe" DTO này.
 */
public record BookingCreatedEvent(
    Long bookingId, 
    Long customerId
    
) {}