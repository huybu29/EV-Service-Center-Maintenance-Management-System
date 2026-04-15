package project.repo.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import project.repo.dtos.PaymentDto;
import project.repo.service.PaymentService;
import project.repo.clients.BookingClient;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Validated
public class PaymentController {

    private final PaymentService paymentService;
    private final BookingClient bookingClient;

    private void verifyOwnership(String role, Long currentUserId, Long targetUserId) {
        if (role != null && role.toUpperCase().contains("CUSTOMER") && !currentUserId.equals(targetUserId)) {
            throw new RuntimeException("Access denied: cannot access others' payments");
        }
    }

    @GetMapping("/")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public List<PaymentDto> getAllPayment() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{userID}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public List<PaymentDto> getPaymentByUserID(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long currentUserId,
            @PathVariable Long userID) {

        verifyOwnership(role, currentUserId, userID);
        return paymentService.getPaymentByUserId(userID);
    }

    @PostMapping("/")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'TECHNICIAN')")
    public PaymentDto createPayment(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody PaymentDto dto) {

        return paymentService.createPayment(userId, dto);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public List<PaymentDto> getMyPayment(
            @RequestHeader("X-User-Id") Long currentUserId) {

        return paymentService.getPaymentByUserId(currentUserId);
    }

    @PutMapping("/{paymentId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public PaymentDto updatePayment(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long paymentId,
            @RequestBody PaymentDto dto) {

        PaymentDto existing = paymentService.getById(paymentId);
        if (existing == null) {
            throw new RuntimeException("Payment không tồn tại.");
        }

        if ("COMPLETED".equalsIgnoreCase(existing.getStatus())) {
            throw new IllegalStateException("Không thể chỉnh sửa Payment đã thanh toán.");
        }

        verifyOwnership(role, userId, existing.getUserID());

        if (dto.getAmount() != null && dto.getAmount() <= 0) {
            throw new IllegalArgumentException("Số tiền phải lớn hơn 0.");
        }

        return paymentService.updatePayment(paymentId, dto);
    }

    @DeleteMapping("/{paymentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePayment(@PathVariable Long paymentId) {
        paymentService.deletePayment(paymentId);
    }

    @GetMapping("/by-booking/{bookingID}")
    public PaymentDto getPaymentByBookingID(@PathVariable Long bookingID) {
        return paymentService.getByBookingID(bookingID);
    }
}