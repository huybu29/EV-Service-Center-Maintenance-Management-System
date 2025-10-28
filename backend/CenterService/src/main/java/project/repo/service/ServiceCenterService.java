package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.ServiceCenterDTO;
import project.repo.entity.ServiceCenter;
import project.repo.mapper.ServiceCenterMapper;
import project.repo.repository.ServiceCenterRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceCenterService {

    private final ServiceCenterRepository serviceCenterRepository;
    private final ServiceCenterMapper serviceCenterMapper;

    // 🔹 1. Tạo mới
    public ServiceCenterDTO create(ServiceCenterDTO dto) {
        ServiceCenter entity = serviceCenterMapper.toEntity(dto);
        ServiceCenter saved = serviceCenterRepository.save(entity);
        return serviceCenterMapper.toDto(saved);
    }

    // 🔹 2. Lấy tất cả
    public List<ServiceCenterDTO> findAll() {
        return serviceCenterRepository.findAll()
                .stream()
                .map(serviceCenterMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 3. Lấy theo ID
    public ServiceCenterDTO findById(Long id) {
        return serviceCenterRepository.findById(id)
                .map(serviceCenterMapper::toDto)
                .orElse(null);
    }

    // 🔹 4. Cập nhật
    public ServiceCenterDTO update(Long id, ServiceCenterDTO dto) {
        ServiceCenter existing = serviceCenterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service Center not found"));

        existing.setName(dto.getName());
        existing.setAddress(dto.getAddress());
        existing.setPhone(dto.getPhone());
        existing.setLatitude(dto.getLatitude());
        existing.setLongitude(dto.getLongitude());

        // Nếu có status trong DTO
        if (dto.getStatus() != null) {
            existing.setStatus(ServiceCenter.StationStatus.valueOf(dto.getStatus()));
        }

        ServiceCenter updated = serviceCenterRepository.save(existing);
        return serviceCenterMapper.toDto(updated);
    }

    // 🔹 5. Xóa
    public void delete(Long id) {
        serviceCenterRepository.deleteById(id);
    }
}
