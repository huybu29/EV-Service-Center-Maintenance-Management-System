package project.repo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.TechnicianDTO;
import project.repo.service.TechnicianService;

import java.util.List;

@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {

    @Autowired
    private TechnicianService technicianService;

    @PostMapping
    public ResponseEntity<TechnicianDTO> create(@RequestBody TechnicianDTO dto) {
        return ResponseEntity.ok(technicianService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TechnicianDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(technicianService.get(id));
    }

    @GetMapping
    public ResponseEntity<List<TechnicianDTO>> list() {
        return ResponseEntity.ok(technicianService.listAll());
    }
}
