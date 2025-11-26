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

        LocalDateTime now = LocalDateTime.now();
        if (appointment.getAppointmentDate().isBefore(now)) {
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

    public List<AppointmentDTO> getAppointmentByServiceCenter(Long serviceCenterId) {
        return appointmentRepository.findByServiceCenterId(serviceCenterId)
                .stream()
                .map(appointmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentByCustomer(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId)
                .stream()
                .map(appointmentMapper::toDto)
                .collect(Collectors.toList());
    }

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
            throw new IllegalArgumentException("Không thể chuyển trạng thái từ " + currentStatus + " sang " + newStatus);
        }

        boolean isTimeChanged = !existing.getAppointmentDate().equals(dto.getAppointmentDate());

        if (newStatus == AppointmentStatus.CANCELED) {
            LocalDateTime now = LocalDateTime.now();
            if (now.plusHours(12).isAfter(existing.getAppointmentDate())) {
                throw new IllegalStateException("Không thể hủy cuộc hẹn trong vòng 12 giờ trước giờ hẹn.");
            }
        }

        existing.setStatus(newStatus);
        existing.setAppointmentDate(dto.getAppointmentDate());
        Appointment saved = appointmentRepository.save(existing);

        if (newStatus == AppointmentStatus.CANCELED) {
            try {
                orderClient.cancelOrderByAppointment(saved.getId());
                sendNotification(
                    saved.getCustomerId(),
                    "Lịch hẹn #" + saved.getId() + " đã bị hủy",
                    "Lịch hẹn ngày " + saved.getAppointmentDate() + " đã được hủy thành công.",
                    "BOOKING_CANCELED"
                );
            } catch (Exception e) {
                System.err.println("⚠ Lỗi khi hủy đơn hàng hoặc gửi thông báo: " + e.getMessage());
            }
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

    public AppointmentDTO acceptBooking(Long appointmentId, Long staffId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy cuộc hẹn với ID: " + appointmentId));

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
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy cuộc hẹn với ID: " + appointmentId));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED ||
            appointment.getStatus() == AppointmentStatus.CANCELED) {
            throw new IllegalStateException("Cuộc hẹn đã hoàn tất hoặc đã bị hủy trước đó.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.plusHours(12).isAfter(appointment.getAppointmentDate())) {
            throw new IllegalStateException("Không thể hủy cuộc hẹn trong vòng 12 giờ trước giờ hẹn.");
        }

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role) && !appointment.getCustomerId().equals(userId)) {
            throw new RuntimeException("Access denied: không thể hủy cuộc hẹn của người khác.");
        }

        appointment.setStatus(AppointmentStatus.CANCELED);
        Appointment saved = appointmentRepository.save(appointment);
        
        try {
            orderClient.cancelOrderByAppointment(saved.getId());
        } catch (Exception e) {
            System.err.println("Lỗi gọi Order Service để hủy đơn: " + e.getMessage());
        }

        sendNotification(
            saved.getCustomerId(),
            "Hủy lịch hẹn thành công #" + saved.getId(),
            "Lịch hẹn ngày " + saved.getAppointmentDate() + " đã được hủy.",
            "BOOKING_CANCELED"
        );

        return appointmentMapper.toDto(saved);
    }

    public void delete(Long id) {
        appointmentRepository.deleteById(id);
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
            case CANCELED:
                return false;
            default:
                return false;
        }
    }
}