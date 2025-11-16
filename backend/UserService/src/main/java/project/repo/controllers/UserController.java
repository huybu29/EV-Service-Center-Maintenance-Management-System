package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.UserDTO;
import project.repo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    // 🔹 Tạo tài khoản khách hàng (nhân viên thực hiện)
     @PostMapping("/create-customer")
public ResponseEntity<UserDTO> createCustomerAccount(@RequestBody UserDTO customerDto) {
    UserDTO created = userService.createCustomerAccount(customerDto);
    return ResponseEntity.ok(created);
}





    // 🧩 Helper kiểm tra quyền truy cập
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return; // hợp lệ
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🟩 1️⃣ Lấy tất cả người dùng (chỉ ADMIN)
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "ADMIN");
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 🟩 2️⃣ Lấy người dùng theo vai trò (chỉ ADMIN)
    @GetMapping("/role/{roleName}")
    public ResponseEntity<List<UserDTO>> getUsersByRole(
            @RequestHeader("X-User-Role") String role,
            @PathVariable String roleName) {

        checkRole(role, "ADMIN", "STAFF");
        return ResponseEntity.ok(userService.getUsersByRole(roleName));
    }

    // 🟩 3️⃣ Lấy người dùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(
            @RequestHeader("X-User-Id") Long currentUserId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        // STAFF hoặc CUSTOMER chỉ được xem thông tin của chính mình
        if ("ROLE_CUSTOMER".equalsIgnoreCase(role) || "ROLE_STAFF".equalsIgnoreCase(role)) {
            if (!currentUserId.equals(id)) {
                throw new RuntimeException("Access denied: cannot view other users' info");
            }
        } else {
            checkRole(role, "ADMIN");
        }

        return ResponseEntity.ok(userService.getUserById(id));
    }

    // 🟩 4️⃣ Tạo người dùng mới (chỉ ADMIN)
    // 🔹 Tạo người dùng mới (ADMIN và STAFF)
@PostMapping
public UserDTO createUser(
        @RequestHeader("X-User-Role") String role,
        @RequestBody UserDTO dto) {

    // Cho phép ADMIN hoặc STAFF
    checkRole(role, "ADMIN", "STAFF");

    // Nếu là STAFF thì chỉ được tạo CUSTOMER
    if (role.equalsIgnoreCase("ROLE_STAFF") && !"CUSTOMER".equalsIgnoreCase(dto.getRole())) {
        throw new RuntimeException("Access denied: STAFF chỉ được phép thêm khách hàng (CUSTOMER)");
    }

    // Mã hóa mật khẩu
    dto.setPassword(passwordEncoder.encode(dto.getPassword()));

    return userService.createUser(dto);
}


    // 🟩 5️⃣ Cập nhật người dùng (chỉ ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody UserDTO dto) {

        checkRole(role, "ADMIN");
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    // 🟩 6️⃣ Xóa người dùng (chỉ ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "ADMIN");
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // 🟩 7️⃣ Lấy profile của chính mình (mọi role)
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getProfile(@RequestHeader("X-User-Id") Long currentUserId) {
        return ResponseEntity.ok(userService.getUserById(currentUserId));
    }
}
