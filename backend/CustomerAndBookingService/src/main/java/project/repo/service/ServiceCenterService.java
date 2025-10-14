package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.repo.entity.ServiceCenter;
import project.repo.repository.ServiceCenterRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceCenterService {

    private final ServiceCenterRepository serviceCenterRepository;

    // Tạo mới
    public ServiceCenter create(ServiceCenter serviceCenter) {
        return serviceCenterRepository.save(serviceCenter);
    }

    // Lấy tất cả
    public List<ServiceCenter> findAll() {
        return serviceCenterRepository.findAll();
    }

    // Lấy theo ID
    public Optional<ServiceCenter> findById(Long id) {
        return serviceCenterRepository.findById(id);
    }

    // Cập nhật
    public ServiceCenter update(Long id, ServiceCenter updated) {
        return serviceCenterRepository.findById(id)
                .map(sc -> {
                    sc.setName(updated.getName());
                    sc.setAddress(updated.getAddress());
                    sc.setPhone(updated.getPhone());
                    return serviceCenterRepository.save(sc);
                })
                .orElseThrow(() -> new RuntimeException("Service Center not found"));
    }

    // Xóa
    public void delete(Long id) {
        serviceCenterRepository.deleteById(id);
    }
}
