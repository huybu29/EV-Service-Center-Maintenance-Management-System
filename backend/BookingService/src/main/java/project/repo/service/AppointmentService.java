package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.clients.OrderClient;
import project.repo.config.RabbitMQConfig;
import project.repo.dtos.AppointmentDTO;
import project.repo.dtos.NotificationEvent;
import project.repo.dtos.OrderDTO;
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
    private final OrderClient orderClient;
    private final RabbitTemplate rabbitTemplate;

    public AppointmentDTO create(AppointmentDTO dto) {
        Appointment appointment = appointmentMapper.toEntity(dto);

        if (appointment.getAppointmentDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Không thể đặt lịch trong quá khứ.");
        }

        appointment.setStatus(AppointmentStatus.PENDING);
        Appointment saved = appointmentRepository.save(appointment);
        
        sendNotification(
            saved.getCustomerId(),
            "Đặt lịch thành công #" + saved.getId(),
            "Lịch hẹn của bạn vào lúc " + saved.getAppointmentDate() + " đang chờ xác nhận.",
            "BOOKING_CREATED"
        );

        return appointmentMapper.toDto(saved);
    }

    public List<AppointmentDTO> getAllAppointment() {
        return appointmentRepository.findAll().stream()
                .map(appointmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public AppointmentDTO getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .map(appointmentMapper::toDto)
                .orElse(null);
    }

    public List<AppointmentDTO> getAppointmentByServiceCenter(Long serviceCenterId) {
        return appointmentRepository.findByServiceCenterId(serviceCenterId).stream()
                .map(appointmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentByCustomer(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId).stream()
                .map(appointmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentByVehicle(Long vehicleId) {
        return appointmentRepository.findByVehicleId(vehicleId).stream()
                .map(appointmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public AppointmentDTO updateAppointment(AppointmentDTO dto) {
        Appointment existing = getAppointmentOrThrow(dto.getId());

        AppointmentStatus newStatus = parseStatus(dto.getStatus());
        validateStatusTransition(existing.getStatus(), newStatus);

        boolean isTimeChanged = !existing.getAppointmentDate().equals(dto.getAppointmentDate());

        if (newStatus == AppointmentStatus.CANCELED) {
            validateCancellationTime(existing.getAppointmentDate());
        }

        existing.setStatus(newStatus);
        existing.setAppointmentDate(dto.getAppointmentDate());
        Appointment saved = appointmentRepository.save(existing);

        if (newStatus == AppointmentStatus.CANCELED) {
            handleCancellationSideEffects(saved);
        } else if (isTimeChanged) {
            sendNotification(
                saved.getCustomerId(),
                "Thay đổi thời gian hẹn #" + saved.getId(),
                "Lịch hẹn của bạn đã được đổi sang: " + saved.getAppointmentDate(),
                "BOOKING_UPDATED"
            );
        }

        return appointmentMapper.toDto(saved);
    }

    public AppointmentDTO updateAppointmentStatus(Long id, String status) {
        Appointment existing = getAppointmentOrThrow(id);
        AppointmentStatus newStatus = parseStatus(status);
        
        validateStatusTransition(existing.getStatus(), newStatus);

        existing.setStatus(newStatus);
        Appointment saved = appointmentRepository.save(existing);

        return appointmentMapper.toDto(saved);
    }

    public AppointmentDTO acceptBooking(Long appointmentId, Long staffId) {
        Appointment appointment = getAppointmentOrThrow(appointmentId);

        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new IllegalStateException("Chỉ có thể nhận cuộc hẹn đang ở trạng thái PENDING.");
        }

        appointment.setStaffId(staffId);
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        Appointment saved = appointmentRepository.save(appointment);

        try {
            OrderDTO orderDTO = OrderDTO.builder()
                    .appointmentId(saved.getId())
                    .vehicleId(saved.getVehicleId())
                    .customerId(saved.getCustomerId())
                    .status("PENDING")
                    .serviceType(saved.getServiceType().name())
                    .build();

            orderClient.createOrderFromBooking(orderDTO);
            
            sendNotification(
                saved.getCustomerId(),
                "Lịch hẹn đã được xác nhận #" + saved.getId(),
                "Vui lòng đến đúng giờ hẹn: " + saved.getAppointmentDate(),
                "BOOKING_CONFIRMED"
            );
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi tạo Order hoặc gửi thông báo: " + e.getMessage());
        }

        return appointmentMapper.toDto(saved);
    }

    public AppointmentDTO cancelBooking(Long appointmentId, Long userId, String role) {
        Appointment appointment = getAppointmentOrThrow(appointmentId);

        if (appointment.getStatus() == AppointmentStatus.COMPLETED ||
            appointment.getStatus() == AppointmentStatus.CANCELED) {
            throw new IllegalStateException("Cuộc hẹn đã hoàn tất hoặc đã bị hủy trước đó.");
        }

        validateCancellationTime(appointment.getAppointmentDate());

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role) && !appointment.getCustomerId().equals(userId)) {
            throw new RuntimeException("Access denied: không thể hủy cuộc hẹn của người khác.");
        }

        appointment.setStatus(AppointmentStatus.CANCELED);
        Appointment saved = appointmentRepository.save(appointment);
        
        handleCancellationSideEffects(saved);

        return appointmentMapper.toDto(saved);
    }

    public void delete(Long id) {
        appointmentRepository.deleteById(id);
    }

    private Appointment getAppointmentOrThrow(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lịch hẹn với ID: " + id));
    }

    private AppointmentStatus parseStatus(String status) {
        try {
            return AppointmentStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + status);
        }
    }

    private void validateStatusTransition(AppointmentStatus current, AppointmentStatus next) {
        boolean isValid = false;
        if (current == next) isValid = true;
        else {
            switch (current) {
                case PENDING:
                    isValid = (next == AppointmentStatus.CONFIRMED || next == AppointmentStatus.CANCELED);
                    break;
                case CONFIRMED:
                    isValid = (next == AppointmentStatus.IN_PROGRESS || next == AppointmentStatus.CANCELED);
                    break;
                case IN_PROGRESS:
                    isValid = (next == AppointmentStatus.COMPLETED || next == AppointmentStatus.CANCELED);
                    break;
                case COMPLETED:
                case CANCELED:
                    isValid = false;
                    break;
            }
        }
        if (!isValid) {
            throw new IllegalArgumentException("Không thể chuyển trạng thái từ " + current + " sang " + next);
        }
    }

    private void validateCancellationTime(LocalDateTime appointmentDate) {
        if (LocalDateTime.now().plusHours(12).isAfter(appointmentDate)) {
            throw new IllegalStateException("Không thể hủy cuộc hẹn trong vòng 12 giờ trước giờ hẹn.");
        }
    }

    private void handleCancellationSideEffects(Appointment saved) {
        try {
            orderClient.cancelOrderByAppointment(saved.getId());
        } catch (Exception e) {
            System.err.println("Lỗi gọi Order Service để hủy đơn: " + e.getMessage());
        }

        sendNotification(
            saved.getCustomerId(),
            "Lịch hẹn #" + saved.getId() + " đã bị hủy",
            "Lịch hẹn ngày " + saved.getAppointmentDate() + " đã được hủy thành công.",
            "BOOKING_CANCELED"
        );
    }

    private void sendNotification(Long userId, String title, String message, String type) {
        try {
            NotificationEvent event = NotificationEvent.builder()
                    .userId(userId)
                    .title(title)
                    .message(message)
                    .type(type)
                    .build();
            System.out.println("🚀 Bắt đầu gửi tin RabbitMQ...");   
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE_NAME,
                    RabbitMQConfig.ROUTING_KEY,
                    event
            );
            System.out.println("✅ Gửi thành công!");
            System.out.println("✅ Gửi thông báo: " + type + " tới User " + userId);
        } catch (Exception e) {
            System.err.println("⚠️ Lỗi gửi RabbitMQ: " + e.getMessage());
        }
    }
}