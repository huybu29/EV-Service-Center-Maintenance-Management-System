package project.repo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.repo.dtos.VehicleDTO;
import project.repo.entity.Vehicle;
import project.repo.repository.VehicleRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public VehicleDTO toDTO(Vehicle v) {
        VehicleDTO d = new VehicleDTO();
        d.setId(v.getId());
        d.setVin(v.getVin());
        d.setModel(v.getModel());
        d.setMileageKm(v.getMileageKm());
        return d;
    }

    public Vehicle toEntity(VehicleDTO d) {
        Vehicle v = new Vehicle();
        v.setVin(d.getVin());
        v.setModel(d.getModel());
        v.setMileageKm(d.getMileageKm());
        return v;
    }

    public VehicleDTO create(VehicleDTO dto) {
        Vehicle v = toEntity(dto);
        v = vehicleRepository.save(v);
        return toDTO(v);
    }

    public VehicleDTO get(Long id) {
        Vehicle v = vehicleRepository.findById(id).orElseThrow(() -> new RuntimeException("Vehicle not found"));
        return toDTO(v);
    }

    public List<VehicleDTO> listAll() {
        return vehicleRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }
}
