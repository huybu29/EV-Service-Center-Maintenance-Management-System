package project.repo.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import project.repo.dtos.UserDTO; 
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "user-service", url = "http://localhost:8085") 
public interface UserClient {

   
    @GetMapping("/api/users/{id}") 
    UserDTO getUserById(
            @PathVariable("id") Long id,
            @RequestHeader("X-User-Id") Long currentUserId,
            @RequestHeader("X-User-Role") String role
    );
    @PutMapping("/api/users/{id}/staff-status")
    void updateStaffStatus( 
            @PathVariable("id") Long id,
            @RequestHeader("X-User-Role") String role,
            @RequestParam("status") String status
    );
}