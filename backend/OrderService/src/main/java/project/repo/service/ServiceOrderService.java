package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.ServiceOrderDTO;
import project.repo.entity.ServiceOrder;
import project.repo.mapper.ServiceOrderMapper;
import project.repo.repository.ServiceOrderRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceOrderService {

    private final ServiceOrderRepository serviceOrderRepository;
    private final ServiceOrderMapper serviceOrderMapper;

    // 🔹 Tạo mới ServiceOrder
    public ServiceOrderDTO create(ServiceOrderDTO dto) {
        ServiceOrder entity = serviceOrderMapper.toEntity(dto);
        ServiceOrder saved = serviceOrderRepository.save(entity);
        return serviceOrderMapper.toDto(saved);
    }

    // 🔹 Lấy tất cả ServiceOrder
    public List<ServiceOrderDTO> findAll() {
        return serviceOrderRepository.findAll() 
                .stream()
                .map(serviceOrderMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Lấy ServiceOrder theo ID
    public ServiceOrderDTO findById(Long id) {
        return serviceOrderRepository.findById(id) 
                .map(serviceOrderMapper::toDto)
                .orElse(null); 
    }

    // 🔹 Lấy theo centerId (trung tâm)
    public List<ServiceOrderDTO> findByCenter(Long centerId) {
        return serviceOrderRepository.findByCenterId(centerId)
                .stream()
                .map(serviceOrderMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Lấy theo technicianId (kỹ thuật viên)
    public List<ServiceOrderDTO> findByTechnician(Long technicianId) {
        return serviceOrderRepository.findByTechnicianId(technicianId)
                .stream()
                .map(serviceOrderMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Lấy theo vehicleId (xe)
    public List<ServiceOrderDTO> findByVehicle(Long vehicleId) {
        return serviceOrderRepository.findByVehicleId(vehicleId)
                .stream()
                .map(serviceOrderMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Cập nhật ServiceOrder
    public ServiceOrderDTO update(Long id, ServiceOrderDTO dto) {
        return serviceOrderRepository.findById(id)
                .map(existing -> {
                    // Cập nhật thủ công các trường cần thiết
                    existing.setServiceType(dto.getServiceType());
                    existing.setDescription(dto.getDescription());
                    existing.setStatus(ServiceOrder.Status.valueOf(dto.getStatus()));
                    existing.setEstimatedCost(dto.getEstimatedCost());
                    existing.setFinalCost(dto.getFinalCost());
                    existing.setPaymentStatus(dto.getPaymentStatus());
                    existing.setStartedAt(dto.getStartedAt());
                    existing.setCompletedAt(dto.getCompletedAt());
                    return serviceOrderMapper.toDto(serviceOrderRepository.save(existing));
                })
                .orElseThrow(() -> new RuntimeException("Service Order not found"));
    }

    // 🔹 Xóa ServiceOrder
    public void delete(Long id) {
        serviceOrderRepository.deleteById(id);
    }
}
