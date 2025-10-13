package project.repo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.repo.dtos.ServiceChecklistDTO;
import project.repo.dtos.ServiceOrderDTO;
import project.repo.entity.*;
import project.repo.mapper.ServiceOrderMapper;
import project.repo.repository.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceOrderService {

    @Autowired
    private ServiceOrderRepository orderRepository;

    @Autowired
    private ServiceChecklistRepository checklistRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private TechnicianRepository technicianRepository;

    @Autowired
    private ServiceOrderMapper mapper;

    /** Tạo ServiceOrder từ Appointment (nếu appointmentId có) hoặc tạo mới */
    public ServiceOrderDTO createFromAppointment(Long appointmentId, Long technicianId) {
        ServiceOrder order = new ServiceOrder();
        if (appointmentId != null) {
            Appointment a = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            order.setAppointment(a);
            // mark appointment as in_service
            a.setStatus(Appointment.Status.IN_SERVICE);
            appointmentRepository.save(a);
        }

        if (technicianId != null) {
            Technician t = technicianRepository.findById(technicianId)
                    .orElseThrow(() -> new RuntimeException("Technician not found"));
            order.setTechnician(t);
        }

        // if appointment referenced vehicle, link it
        if (order.getAppointment() != null && order.getAppointment().getVehicleId() != null) {
            Vehicle v = vehicleRepository.findById(order.getAppointment().getVehicleId())
                    .orElse(null);
            order.setVehicle(v);
        }

        order.setStatus(ServiceOrder.Status.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        ServiceOrder saved = orderRepository.save(order);
        return mapper.toDTO(saved);
    }

    /** Cập nhật trạng thái */
    public ServiceOrderDTO updateStatus(Long orderId, String statusStr) {
        ServiceOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        ServiceOrder.Status status = ServiceOrder.Status.valueOf(statusStr.toUpperCase());
        order.setStatus(status);
        if (status == ServiceOrder.Status.IN_PROGRESS) {
            order.setStartedAt(LocalDateTime.now());
        } else if (status == ServiceOrder.Status.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
        }
        order = orderRepository.save(order);
        return mapper.toDTO(order);
    }

    /** Ghi checklist (pre hoặc post). Nếu pre-> thêm trước, nếu post-> thêm sau */
    public ServiceChecklistDTO addChecklist(Long orderId, ServiceChecklistDTO dto) {
        ServiceOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        ServiceChecklist c = new ServiceChecklist();
        c.setBatteryStatus(dto.getBatteryStatus());
        c.setTirePressure(dto.getTirePressure());
        c.setBrakeCondition(dto.getBrakeCondition());
        c.setLightSystem(dto.getLightSystem());
        c.setBodyCondition(dto.getBodyCondition());
        c.setObdCodes(dto.getObdCodes());
        c.setTechnicianNotes(dto.getTechnicianNotes());
        c.setPreService(dto.isPreService());
        c.setServiceOrder(order);

        ServiceChecklist saved = checklistRepository.save(c);
        // also add to order entity list for mapping convenience
        order.getChecklists().add(saved);
        orderRepository.save(order);

        return mapper.checklistToDTO(saved);
    }

    public List<ServiceOrderDTO> listAll() {
        return orderRepository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    public ServiceOrderDTO get(Long id) {
        return orderRepository.findById(id).map(mapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
