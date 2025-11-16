package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.VehicleDTO;
import project.repo.entity.Vehicle;
import project.repo.mapper.VehicleMapper;
import project.repo.repository.VehicleRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    // 🔹 Tạo xe mới
    public VehicleDTO create(VehicleDTO dto) {
        Vehicle vehicle = vehicleMapper.toEntity(dto);
        Vehicle saved = vehicleRepository.save(vehicle);
        return vehicleMapper.toDto(saved);
    }

    // 🔹 Lấy tất cả xe
    public List<VehicleDTO> getAll() {
        return vehicleRepository.findAll()
                .stream()
                .map(vehicleMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Lấy xe theo ID
    public List<VehicleDTO> getById(Long id) {
        return vehicleRepository.findById(id)
                .map(vehicleMapper::toDto)
                .stream()
                .collect(Collectors.toList());
    }

    // 🔹 Lấy xe theo Customer ID
    public List<VehicleDTO> getByCustomer(Long customerId) {
        return vehicleRepository.findByCustomerId(customerId)
                .stream()
                .map(vehicleMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Cập nhật thông tin xe
    public VehicleDTO update(Long id, VehicleDTO dto) {
        Vehicle existing = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        existing.setBrand(dto.getBrand());
        existing.setModel(dto.getModel());
        existing.setVin(dto.getVin());
        existing.setBatteryType(dto.getBatteryType());
        existing.setManufactureYear(dto.getManufactureYear());
        existing.setCurrentMileage(dto.getCurrentMileage());
        existing.setStatus(dto.getStatus());
        Vehicle saved = vehicleRepository.save(existing);
        return vehicleMapper.toDto(saved);
    }

    // 🔹 Xóa xe
    public void delete(Long id) {
        vehicleRepository.deleteById(id);
    }

    


 

}

