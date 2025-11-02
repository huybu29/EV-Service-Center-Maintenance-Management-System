package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.NotificationDTO;
import project.repo.entity.Notification;
import project.repo.mapper.NotificationMapper;
import project.repo.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    // 🔹 Tạo thông báo mới
    public NotificationDTO create(NotificationDTO dto) {
        Notification entity = notificationMapper.toEntity(dto);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setIsRead(false);
        Notification saved = notificationRepository.save(entity);
        return notificationMapper.toDto(saved);
    }

    // 🔹 Lấy tất cả thông báo
    public List<NotificationDTO> getAll() {
        return notificationRepository.findAll()
                .stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Lấy thông báo theo ID
    public NotificationDTO getById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        return notificationMapper.toDto(notification);
    }

    // 🔹 Lấy thông báo theo User ID
    public List<NotificationDTO> getByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Lấy thông báo chưa đọc của user
    public List<NotificationDTO> getUnreadByUser(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId)
                .stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Đánh dấu thông báo đã đọc
    public NotificationDTO markAsRead(Long id) {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        existing.setIsRead(true);
        existing.setReadAt(LocalDateTime.now());
        Notification updated = notificationRepository.save(existing);
        return notificationMapper.toDto(updated);
    }

    // 🔹 Cập nhật nội dung thông báo (nếu cần chỉnh sửa)
    public NotificationDTO update(Long id, NotificationDTO dto) {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        existing.setTitle(dto.getTitle());
        existing.setMessage(dto.getMessage());
        existing.setType(Notification.NotificationType.valueOf(dto.getType()));
        existing.setChannel(Notification.Channel.valueOf(dto.getChannel()));
        existing.setReferenceId(dto.getReferenceId());

        Notification updated = notificationRepository.save(existing);
        return notificationMapper.toDto(updated);
    }

    // 🔹 Xóa thông báo
    public void delete(Long id) {
        notificationRepository.deleteById(id);
    }
}
