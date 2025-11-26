package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import project.repo.dtos.PartForecastDTO;
import project.repo.dtos.PartsDTO;
import project.repo.service.PartsService;

import java.util.List;

@RestController
@RequestMapping("/api/parts")
@RequiredArgsConstructor
public class PartsController {

    private final PartsService partsService;

    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 1. Tạo mới linh kiện (Chỉ ADMIN)
    @PostMapping
    public PartsDTO create(
            @RequestHeader("X-User-Role") String role,
            @RequestBody PartsDTO dto) {

        checkRole(role, "ADMIN");
        return partsService.create(dto);
    }

    // 🔹 2. Lấy danh sách (Hỗ trợ tìm kiếm)
    // Cho phép: CUSTOMER (xem giá), STAFF, ADMIN, TECHNICIAN (tìm đồ để thay)
    @GetMapping
    public List<PartsDTO> getAll(
            @RequestHeader("X-User-Role") String role,
            @RequestParam(required = false) String search) { // Thêm param search
        
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN", "TECHNICIAN");
        
        if (search != null && !search.isEmpty()) {
            return partsService.searchParts(search);
        }
        return partsService.findAll();
    }

    // 🔹 3. Lấy chi tiết
    @GetMapping("/{id}")
    public PartsDTO getById(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "CUSTOMER", "STAFF", "ADMIN", "TECHNICIAN");
        return partsService.findById(id);
    }

    // 🔹 4. Cập nhật linh kiện (Logic phân quyền nằm trong Service)
    @PutMapping("/{id}")
    public PartsDTO update(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody PartsDTO dto) {

        // Cho phép cả ADMIN và STAFF gọi, nhưng Service sẽ xử lý logic ai được sửa gì
        checkRole(role, "ADMIN", "STAFF");
        
        return partsService.updatePartByRole(id, dto, role);
    }

    // 🔹 5. Xóa linh kiện (Chỉ ADMIN)
    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "ADMIN");
        partsService.delete(id);
    }

    // 🔹 6. Trừ kho (Dùng cho API nội bộ hoặc Staff xuất kho lẻ)
    // Lưu ý: OrderService sẽ gọi cái này qua Feign Client
    @PostMapping("/{id}/decrease")
    public PartsDTO decreaseQuantity(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestParam int amount) {

        checkRole(role, "STAFF", "ADMIN", "TECHNICIAN");

        return partsService.decreaseQuantity(id, amount);
    }
    @GetMapping("/suggest")
    public PartsDTO getSuggestedPart(
            @RequestHeader("X-User-Role") String role,
            @RequestParam String taskName) {
        
        checkRole(role, "TECHNICIAN", "STAFF", "ADMIN");
        return partsService.getSuggestedPartByTask(taskName);
    }
    @PutMapping("/update-forecast")
    public ResponseEntity<Void> updateForecast(@RequestBody PartForecastDTO dto) {
        
        // Gọi service chỉ cần truyền DTO là đủ
        partsService.updateAiForecast(dto);
        
        return ResponseEntity.ok().build();
    }
}