package project.repo.controllers;   

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.NotificationDTO;
import project.repo.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // 🔹 Helper kiểm tra role
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 1️⃣ Lấy danh sách thông báo dựa theo role
    @GetMapping
    public List<NotificationDTO> getNotifications(
            
    ) {
        return notificationService.getAll();
    }

    // 🔹 2️⃣ Lấy thông báo theo ID (mọi role đều xem được nếu là của mình)
    @GetMapping("/{id}")
    public NotificationDTO getById(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id
    ) {
        NotificationDTO dto = notificationService.getById(id);

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role) || "ROLE_STAFF".equalsIgnoreCase(role)) {
            if (!dto.getUserId().equals(userId)) {
                throw new RuntimeException("Access denied: cannot view others' notifications");
            }
        }

        return dto;
    }

    // 🔹 3️⃣ Lấy thông báo chưa đọc của user
    @GetMapping("/unread")
    public List<NotificationDTO> getUnread(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId
    ) {
        checkRole(role, "ADMIN", "STAFF", "CUSTOMER");
        return notificationService.getUnreadByUser(userId);
    }

    // 🔹 4️⃣ Đánh dấu đã đọc
    @PutMapping("/{id}/read")
    public NotificationDTO markAsRead(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id
    ) {
        NotificationDTO dto = notificationService.getById(id);

        // Customer & Staff chỉ được đánh dấu thông báo của chính họ
        if (("ROLE_CUSTOMER".equalsIgnoreCase(role) || "ROLE_STAFF".equalsIgnoreCase(role))
                && !dto.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied: cannot modify others' notifications");
        }

        return notificationService.markAsRead(id);
    }

    // 🔹 5️⃣ Tạo thông báo mới (chỉ ADMIN, STAFF)
    @PostMapping
    public NotificationDTO create(
            @RequestHeader("X-User-Role") String role,
            @RequestBody NotificationDTO dto
    ) {
        checkRole(role, "ADMIN", "STAFF");
        return notificationService.create(dto);
    }

    // 🔹 6️⃣ Xóa thông báo (chỉ ADMIN)
    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id
    ) {
        checkRole(role, "ADMIN");
        notificationService.delete(id);
    }
}