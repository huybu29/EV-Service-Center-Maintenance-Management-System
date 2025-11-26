package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.ServiceCenterDTO;
import project.repo.entity.ServiceCenter;
import project.repo.mapper.ServiceCenterMapper;
import project.repo.repository.ServiceCenterRepository;

import java.util.List;
import java.util.stream.Collectors;

// Tên Cache dùng chung
final class CacheNames {
    public static final String STATIONS = "stations";
}

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceCenterService {

    private final ServiceCenterRepository serviceCenterRepository;
    private final ServiceCenterMapper serviceCenterMapper;

    // 🔹 1. Tạo mới: Xóa toàn bộ cache list (vì findAll() thay đổi)
    @CacheEvict(value = CacheNames.STATIONS, allEntries = true)
    public ServiceCenterDTO create(ServiceCenterDTO dto) {
        ServiceCenter entity = serviceCenterMapper.toEntity(dto);
        ServiceCenter saved = serviceCenterRepository.save(entity);
        return serviceCenterMapper.toDto(saved);
    }

    // 🔹 2. Lấy tất cả: Cache kết quả
    // Cache Key sẽ là tên method (findAll)
    @Cacheable(CacheNames.STATIONS)
    public List<ServiceCenterDTO> findAll() {
        return serviceCenterRepository.findAll()
                .stream()
                .map(serviceCenterMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 3. Lấy theo ID: Cache kết quả theo ID
    @Cacheable(value = CacheNames.STATIONS, key = "#id")
    public ServiceCenterDTO findById(Long id) {
        return serviceCenterRepository.findById(id)
                .map(serviceCenterMapper::toDto)
                .orElse(null);
    }

    // 🔹 4. Cập nhật: Xóa entry cũ dựa trên ID
    @CacheEvict(value = CacheNames.STATIONS, key = "#id")
    public ServiceCenterDTO update(Long id, ServiceCenterDTO dto) {
        ServiceCenter existing = serviceCenterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service Center not found"));

        existing.setName(dto.getName());
        existing.setAddress(dto.getAddress());
        existing.setPhone(dto.getPhone());
        existing.setLatitude(dto.getLatitude());
        existing.setLongitude(dto.getLongitude());

        if (dto.getStatus() != null) {
            existing.setStatus(ServiceCenter.StationStatus.valueOf(dto.getStatus()));
        }

        ServiceCenter updated = serviceCenterRepository.save(existing);
        return serviceCenterMapper.toDto(updated);
    }

    // 🔹 5. Xóa: Xóa entry cụ thể và xóa cache list (allEntries)
    @Caching(evict = { 
        // Xóa entry của ID này
        @CacheEvict(value = CacheNames.STATIONS, key = "#id"), 
        // Xóa cache của findAll()
        @CacheEvict(value = CacheNames.STATIONS, allEntries = true) 
    })
    public void delete(Long id) {
        serviceCenterRepository.deleteById(id);
    }
}