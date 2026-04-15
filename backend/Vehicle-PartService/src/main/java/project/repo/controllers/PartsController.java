package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.PartForecastDTO;
import project.repo.dtos.PartsDTO;
import project.repo.service.PartsService;

import java.util.List;

@RestController
@RequestMapping("/api/parts")
@RequiredArgsConstructor
public class PartsController {

    private final PartsService partsService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PartsDTO create(@RequestBody PartsDTO dto) {
        return partsService.create(dto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public List<PartsDTO> getAll(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return partsService.searchParts(search);
        }
        return partsService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public PartsDTO getById(@PathVariable Long id) {
        return partsService.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public PartsDTO update(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody PartsDTO dto) {
        return partsService.updatePartByRole(id, dto, role);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        partsService.delete(id);
    }

    @PostMapping("/{id}/decrease")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public PartsDTO decreaseQuantity(
            @PathVariable Long id,
            @RequestParam int amount) {
        return partsService.decreaseQuantity(id, amount);
    }

    @GetMapping("/suggest")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'STAFF', 'ADMIN')")
    public PartsDTO getSuggestedPart(@RequestParam String taskName) {
        return partsService.getSuggestedPartByTask(taskName);
    }

    @PutMapping("/update-forecast")
    public ResponseEntity<Void> updateForecast(@RequestBody PartForecastDTO dto) {
        partsService.updateAiForecast(dto);
        return ResponseEntity.ok().build();
    }
}