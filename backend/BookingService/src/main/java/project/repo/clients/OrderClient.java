package project.repo.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.OrderDTO;

@FeignClient(name = "order-service", url = "http://localhost:8083")
public interface OrderClient {

    @PostMapping("/api/orders/from-booking")
    OrderDTO createOrderFromBooking(@RequestBody OrderDTO orderDTO);
}
