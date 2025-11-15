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

    // 🔹 Helper kiểm tra quyền truy cập
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 1. Tạo mới linh kiện (ADMIN)
    @PostMapping
    public PartsDTO create(
            @RequestHeader("X-User-Role") String role,
            @RequestBody PartsDTO dto) {

        checkRole(role, "ADMIN");
        return partsService.create(dto);
    }

    // 🔹 2. Lấy tất cả linh kiện (CUSTOMER, STAFF, ADMIN)
    @GetMapping
    public List<PartsDTO> getAll(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return partsService.findAll();
    }

    // 🔹 3. Lấy linh kiện theo ID
    @GetMapping("/{id}")
    public PartsDTO getById(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return partsService.findById(id);
    }

    // 🔹 4. Cập nhật linh kiện
    //    - ADMIN: có thể sửa toàn bộ
    //    - STAFF: chỉ được sửa quantity & minQuantity
    @PutMapping("/{id}")
    public PartsDTO update(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody PartsDTO dto) {

        if (role.equalsIgnoreCase("ROLE_ADMIN")) {
            return partsService.update(id, dto);
        } 
        else if (role.equalsIgnoreCase("ROLE_STAFF")) {
            PartsDTO existing = partsService.findById(id);

            // 🔹 Chỉ cập nhật số lượng và tồn kho tối thiểu
            existing.setQuantity(dto.getQuantity());
            existing.setMinQuantity(dto.getMinQuantity());

            // Không cho phép thay đổi giá, tên, mã, loại, trạng thái
            return partsService.update(id, existing);
        } 
        else {
            throw new RuntimeException("Access denied: only ADMIN or STAFF can update parts");
        }
    }

    // 🔹 5. Xóa linh kiện (ADMIN)
    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "ADMIN");
        partsService.delete(id);
    }
}
