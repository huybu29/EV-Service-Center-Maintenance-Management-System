package project.repo.clients;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import project.repo.dtos.PaymentDto;
import org.springframework.web.bind.annotation.RequestHeader;
@FeignClient(name = "payment-service", url = "http://localhost:8084") 
public interface PaymentClient {
    @PostMapping("/api/payments/")
    void createPayment(@RequestHeader("X-User-Role") String role,  
        @RequestHeader("X-User-Id") Long userId,
        @RequestBody PaymentDto paymentDto);
}