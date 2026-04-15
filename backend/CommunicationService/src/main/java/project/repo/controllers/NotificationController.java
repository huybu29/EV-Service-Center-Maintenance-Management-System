package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.NotificationDTO;
import project.repo.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    private void verifyOwnership(String role, Long currentUserId, Long targetUserId) {
        if (role != null && (role.toUpperCase().contains("CUSTOMER") || role.toUpperCase().contains("STAFF")) && !currentUserId.equals(targetUserId)) {
            throw new RuntimeException("Access denied: cannot access others' notifications");
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<NotificationDTO> getNotifications() {
        return notificationService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public NotificationDTO getById(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {

        NotificationDTO dto = notificationService.getById(id);
        verifyOwnership(role, userId, dto.getUserId());
        return dto;
    }

    @GetMapping("/unread")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public List<NotificationDTO> getUnread(
            @RequestHeader("X-User-Id") Long userId) {

        return notificationService.getUnreadByUser(userId);
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public NotificationDTO markAsRead(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {

        NotificationDTO dto = notificationService.getById(id);
        verifyOwnership(role, userId, dto.getUserId());
        return notificationService.markAsRead(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public NotificationDTO create(@RequestBody NotificationDTO dto) {
        return notificationService.create(dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        notificationService.delete(id);
    }
}