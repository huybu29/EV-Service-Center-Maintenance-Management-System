package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.ServiceCenterDTO;
import project.repo.service.ServiceCenterService;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class ServiceCenterController {

    private final ServiceCenterService serviceCenterService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ServiceCenterDTO create(@RequestBody ServiceCenterDTO dto) {
        return serviceCenterService.create(dto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public List<ServiceCenterDTO> getAll() {
        return serviceCenterService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ServiceCenterDTO getById(@PathVariable Long id) {
        return serviceCenterService.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ServiceCenterDTO update(
            @PathVariable Long id,
            @RequestBody ServiceCenterDTO dto) {
        return serviceCenterService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        serviceCenterService.delete(id);
    }
}