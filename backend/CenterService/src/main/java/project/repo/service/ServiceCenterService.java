package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.ServiceCenterDTO;
import project.repo.entity.ServiceCenter;
import project.repo.mapper.ServiceCenterMapper;
import project.repo.repository.ServiceCenterRepository;

import java.util.List;
import java.util.stream.Collectors;

final class CacheNames {
    public static final String STATIONS = "stations";
}

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceCenterService {

    private final ServiceCenterRepository serviceCenterRepository;
    private final ServiceCenterMapper serviceCenterMapper;

    @CacheEvict(value = CacheNames.STATIONS, allEntries = true)
    public ServiceCenterDTO create(ServiceCenterDTO dto) {
        ServiceCenter entity = serviceCenterMapper.toEntity(dto);
        ServiceCenter saved = serviceCenterRepository.save(entity);
        return serviceCenterMapper.toDto(saved);
    }

    @Cacheable(CacheNames.STATIONS)
    public List<ServiceCenterDTO> findAll() {
        return serviceCenterRepository.findAll()
                .stream()
                .map(serviceCenterMapper::toDto)
                .collect(Collectors.toList());
    }

    @Cacheable(value = CacheNames.STATIONS, key = "#id")
    public ServiceCenterDTO findById(Long id) {
        return serviceCenterRepository.findById(id)
                .map(serviceCenterMapper::toDto)
                .orElse(null);
    }

    @CacheEvict(value = CacheNames.STATIONS, allEntries = true)
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

    @CacheEvict(value = CacheNames.STATIONS, allEntries = true)
    public void delete(Long id) {
        serviceCenterRepository.deleteById(id);
    }
}