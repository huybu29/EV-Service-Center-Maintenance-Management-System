package project.repo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.repo.dtos.AppointmentDTO;
import project.repo.entity.Appointment;
import project.repo.repository.AppointmentRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public AppointmentDTO toDTO(Appointment a) {
        AppointmentDTO d = new AppointmentDTO();
        d.setId(a.getId());
        d.setCustomerId(a.getCustomerId());
        d.setVehicleId(a.getVehicleId());
        d.setServiceType(a.getServiceType());
        d.setAppointmentTime(a.getAppointmentTime());
        d.setStatus(a.getStatus() != null ? a.getStatus().name() : null);
        return d;
    }

    public Appointment toEntity(AppointmentDTO d) {
        Appointment a = new Appointment();
        a.setCustomerId(d.getCustomerId());
        a.setVehicleId(d.getVehicleId());
        a.setServiceType(d.getServiceType());
        a.setAppointmentTime(d.getAppointmentTime());
        if (d.getStatus() != null) {
            a.setStatus(Appointment.Status.valueOf(d.getStatus()));
        } else {
            a.setStatus(Appointment.Status.SCHEDULED);
        }
        return a;
    }

    public AppointmentDTO create(AppointmentDTO dto) {
        Appointment a = toEntity(dto);
        a = appointmentRepository.save(a);
        return toDTO(a);
    }

    public AppointmentDTO get(Long id) {
        Appointment a = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return toDTO(a);
    }

    public List<AppointmentDTO> listAll() {
        return appointmentRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }
}
