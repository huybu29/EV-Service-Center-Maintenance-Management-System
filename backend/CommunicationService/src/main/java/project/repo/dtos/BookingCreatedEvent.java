package project.repo.dtos; // (Đổi package cho đúng)

/**
 * DTO (Event) này phải khớp 100% với DTO của Publisher
 */
public record BookingCreatedEvent(
    Long bookingId, 
    Long customerId, 
    Double estimatedAmount
) {}