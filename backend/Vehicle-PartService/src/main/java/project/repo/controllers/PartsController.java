package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.PartsDTO;
import project.repo.service.PartsService;

import java.util.List;

@RestController
@RequestMapping("/api/parts")
@RequiredArgsConstructor
public class PartsController {

    private final PartsService partsService;

    // 🔹 Helper kiểm tra role
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 1. Tạo mới linh kiện (chỉ ADMIN)
    @PostMapping
    public PartsDTO create(
            @RequestHeader("X-User-Role") String role,
            @RequestBody PartsDTO dto) {

        checkRole(role, "ADMIN");
        return partsService.create(dto);
    }

    // 🔹 2. Lấy danh sách tất cả linh kiện (STAFF, ADMIN, CUSTOMER)
    @GetMapping
    public List<PartsDTO> getAll(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return partsService.findAll();
    }

    // 🔹 3. Lấy linh kiện theo ID (STAFF, ADMIN, CUSTOMER)
    @GetMapping("/{id}")
    public PartsDTO getById(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return partsService.findById(id);
    }

    // 🔹 4. Cập nhật linh kiện (chỉ ADMIN)
    @PutMapping("/{id}")
    public PartsDTO update(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody PartsDTO dto) {

        checkRole(role, "ADMIN");
        return partsService.update(id, dto);
    }

    // 🔹 5. Xóa linh kiện (chỉ ADMIN)
    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "ADMIN");
        partsService.delete(id);
    }

    // 🔹 6. Trừ số lượng linh kiện (chỉ STAFF, ADMIN)
// Không thể trừ khi quantity = 0
@PostMapping("/{id}/decrease")
public PartsDTO decreaseQuantity(
        @RequestHeader("X-User-Role") String role,
        @PathVariable Long id,
        @RequestParam int amount) {

    checkRole(role, "STAFF", "ADMIN"); // Chỉ STAFF hoặc ADMIN mới trừ được

    return partsService.decreaseQuantity(id, amount);
}

}
