package project.repo.mapper;

import org.springframework.stereotype.Component;
import project.repo.dtos.ServiceChecklistDTO;
import project.repo.dtos.ServiceOrderDTO;
import project.repo.entity.ServiceChecklist;
import project.repo.entity.ServiceOrder;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ServiceOrderMapper {

    public ServiceOrderDTO toDTO(ServiceOrder entity) {
        ServiceOrderDTO dto = new ServiceOrderDTO();
        dto.setId(entity.getId());
        dto.setAppointmentId(entity.getAppointment() != null ? entity.getAppointment().getId() : null);
        dto.setVehicleId(entity.getVehicle() != null ? entity.getVehicle().getId() : null);
        dto.setTechnicianId(entity.getTechnician() != null ? entity.getTechnician().getId() : null);
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setStartedAt(entity.getStartedAt());
        dto.setCompletedAt(entity.getCompletedAt());

        List<ServiceChecklistDTO> checklistDTOS = entity.getChecklists()
                .stream()
                .map(this::checklistToDTO)
                .collect(Collectors.toList());
        dto.setChecklists(checklistDTOS);

        return dto;
    }

    public ServiceChecklistDTO checklistToDTO(ServiceChecklist c) {
        ServiceChecklistDTO d = new ServiceChecklistDTO();
        d.setId(c.getId());
        d.setServiceOrderId(c.getServiceOrder() != null ? c.getServiceOrder().getId() : null);
        d.setBatteryStatus(c.getBatteryStatus());
        d.setTirePressure(c.getTirePressure());
        d.setBrakeCondition(c.getBrakeCondition());
        d.setLightSystem(c.getLightSystem());
        d.setBodyCondition(c.getBodyCondition());
        d.setObdCodes(c.getObdCodes());
        d.setTechnicianNotes(c.getTechnicianNotes());
        d.setPreService(c.isPreService());
        return d;
    }
}
