package project.repo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.VehicleDTO;
import project.repo.service.VehicleService;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<VehicleDTO> create(@RequestBody VehicleDTO dto) {
        return ResponseEntity.ok(vehicleService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.get(id));
    }

    @GetMapping
    public ResponseEntity<List<VehicleDTO>> list() {
        return ResponseEntity.ok(vehicleService.listAll());
    }
}
