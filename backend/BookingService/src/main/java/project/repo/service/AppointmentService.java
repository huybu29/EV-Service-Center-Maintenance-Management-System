package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.AppointmentDTO;
import project.repo.entity.Appointment;
import project.repo.entity.Appointment.AppointmentStatus;
import project.repo.mapper.AppointmentMapper;
import project.repo.repository.AppointmentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;

    public AppointmentDTO create(AppointmentDTO dto) {
        Appointment appointment = appointmentMapper.toEntity(dto);

        LocalDateTime now = LocalDateTime.now();
        if (appointment.getAppointmentDate().isBefore(now)) {
            throw new IllegalArgumentException("Không thể đặt lịch trong quá khứ.");
        }


        boolean exists = appointmentRepository.existsByAppointmentDateAndTechnicianId(
                appointment.getAppointmentDate(),
                appointment.getTechnicianId()
        );

        if (exists) {
            throw new IllegalArgumentException("Slot này đã có người đặt, vui lòng chọn thời gian khác.");
        }

        Appointment saved = appointmentRepository.save(appointment);
        return appointmentMapper.toDto(saved);
    }

    // 🔹 Lấy tất cả Appointment
    public List<AppointmentDTO> getAllAppointment() {
        return appointmentRepository.findAll()
                .stream()
                .map(appointmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public AppointmentDTO getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .map(appointmentMapper::toDto)
                .orElse(null);
    }

    // 🔹 Tìm Appointment theo Customer ID
    public List<AppointmentDTO> getAppointmentByCustomer(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId)
                .stream()
                .map(appointmentMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Tìm Appointment theo Vehicle ID
    public List<AppointmentDTO> getAppointmentByVehicle(Long vehicleId) {
        return appointmentRepository.findByVehicleId(vehicleId)
                .stream()
                .map(appointmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public AppointmentDTO updateAppointment(AppointmentDTO dto) {
    Appointment existing = appointmentRepository.findById(dto.getId())
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lịch hẹn với ID: " + dto.getId()));

    AppointmentStatus currentStatus = existing.getStatus();

    
    AppointmentStatus newStatus;
    try {
        newStatus = AppointmentStatus.valueOf(dto.getStatus().toUpperCase());
    } catch (IllegalArgumentException e) {
        throw new IllegalArgumentException("Trạng thái không hợp lệ: " + dto.getStatus());
    }

    
    if (!isValidStatusTransition(currentStatus, newStatus)) {
        throw new IllegalArgumentException("Không thể chuyển trạng thái từ " 
            + currentStatus + " sang " + newStatus);
    }

    existing.setStatus(newStatus);
    existing.setAppointmentDate(dto.getAppointmentDate());

    Appointment saved = appointmentRepository.save(existing);
    return appointmentMapper.toDto(saved);
}

    private boolean isValidStatusTransition(AppointmentStatus current, AppointmentStatus next) {
    if (current == next) return true; 

    switch (current) {
        case PENDING:
            return next == AppointmentStatus.CONFIRMED || next == AppointmentStatus.CANCELED;
        case CONFIRMED:
            return next == AppointmentStatus.IN_PROGRESS || next == AppointmentStatus.CANCELED;
        case IN_PROGRESS:
            return next == AppointmentStatus.COMPLETED || next == AppointmentStatus.CANCELED;
        case COMPLETED:
            return false; 
        case CANCELED:
            return false; 
        default:
            return false;
    }
}
    public AppointmentDTO acceptBooking(Long appointmentId, Long staffId) {
    Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy cuộc hẹn với ID: " + appointmentId));

   
    if (appointment.getStatus() != Appointment.AppointmentStatus.PENDING) {
        throw new IllegalStateException("Chỉ có thể nhận cuộc hẹn đang ở trạng thái PENDING.");
    }

    appointment.setTechnicianId(staffId);
    appointment.setStatus(Appointment.AppointmentStatus.CONFIRMED);

    Appointment saved = appointmentRepository.save(appointment);
    return appointmentMapper.toDto(saved);
}
    public AppointmentDTO cancelBooking(Long appointmentId, Long userId, String role) {
    Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy cuộc hẹn với ID: " + appointmentId));

   
    if (appointment.getStatus() == Appointment.AppointmentStatus.COMPLETED ||
        appointment.getStatus() == Appointment.AppointmentStatus.CANCELED) {
        throw new IllegalStateException("Cuộc hẹn đã hoàn tất hoặc đã bị hủy trước đó.");
    }

    LocalDateTime now = LocalDateTime.now();
    LocalDateTime appointmentDate = appointment.getAppointmentDate();

    if (now.plusHours(12).isAfter(appointmentDate)) {
        throw new IllegalStateException("Không thể hủy cuộc hẹn trong vòng 12 giờ trước giờ hẹn.");
    }

    if ("ROLE_CUSTOMER".equalsIgnoreCase(role) && !appointment.getCustomerId().equals(userId)) {
        throw new RuntimeException("Access denied: không thể hủy cuộc hẹn của người khác.");
    }

    appointment.setStatus(Appointment.AppointmentStatus.CANCELED);
    Appointment saved = appointmentRepository.save(appointment);

    return appointmentMapper.toDto(saved);
}
    // 🔹 Xóa Appointment
    public void delete(Long id) {
        appointmentRepository.deleteById(id);
    }
}
