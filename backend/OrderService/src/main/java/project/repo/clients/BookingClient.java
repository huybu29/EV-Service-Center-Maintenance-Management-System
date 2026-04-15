package project.repo.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import project.repo.dtos.AppointmentDTO;

import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "Booking-service", url = "http://localhost:8081", contextId = "bookingClient") 
public interface BookingClient {
    @PutMapping("/api/appointments/{id}/{status}")
    AppointmentDTO updateAppointmentStatus(@PathVariable Long id,
        @PathVariable String status,
        @RequestHeader("X-User-Role") String role);  

   
}