package project.repo.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import project.repo.dtos.VehicleDTO;


@FeignClient(name = "vehicle-part-service", url = "http://localhost:8086", contextId = "vehicleClient") 
public interface VehicleClient {

    @GetMapping("/api/vehicles/{id}") 
    VehicleDTO getVehicleById(
            @PathVariable("id") Long id,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId
    );
}