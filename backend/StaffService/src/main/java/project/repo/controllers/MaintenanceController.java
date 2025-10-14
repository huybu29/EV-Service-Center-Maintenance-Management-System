package project.repo.controllers;

import org.springframework.web.bind.annotation.*;
import project.repo.entity.MaintenanceOrder;
import project.repo.service.MaintenanceService;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {
    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PutMapping("/assign/{orderId}/{techId}")
    public MaintenanceOrder assignTechnician(
            @PathVariable Long orderId,
            @PathVariable Long techId) {
        return maintenanceService.assignTechnician(orderId, techId);
    }
}
