package project.repo.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.PartsDTO; 

@FeignClient(name = "vehicle-part-service", url = "http://localhost:8086", contextId = "partClient") 
public interface PartClient {

    
    @GetMapping("/api/parts/{id}")
    PartsDTO getPartById(
        @RequestHeader("X-User-Role") String role,
        @PathVariable("id") Long id
    );


    @PostMapping("/api/parts/{id}/decrease")
    PartsDTO decreaseQuantity(
        @RequestHeader("X-User-Role") String role,
        @PathVariable("id") Long id,
        @RequestParam("amount") int amount
    );
}