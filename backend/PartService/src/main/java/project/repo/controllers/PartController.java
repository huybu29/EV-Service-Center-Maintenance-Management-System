package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import project.repo.entity.Parts;
import project.repo.service.PartService;

@RestController
@RequestMapping("/api/parts")
@RequiredArgsConstructor
public class PartController {

    private final PartService partService;

    // Lấy danh sách toàn bộ phụ tùng
    @GetMapping
    public ResponseEntity<List<Parts>> getAllParts() {
        return ResponseEntity.ok(partService.getAllParts());
    }

    // Lấy phụ tùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Parts> getPartById(@PathVariable Long id) {
        return partService.getPartById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Thêm mới hoặc cập nhật phụ tùng
    @PostMapping
    public ResponseEntity<Parts> savePart(@RequestBody Parts part) {
        return ResponseEntity.ok(partService.savePart(part));
    }

    // Xóa phụ tùng theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePart(@PathVariable Long id) {
        partService.deletePart(id);
        return ResponseEntity.noContent().build();
    }

    // Danh sách phụ tùng tồn kho thấp
    @GetMapping("/low-stock")
    public ResponseEntity<List<Parts>> getLowStockParts() {
        return ResponseEntity.ok(partService.getLowStockParts());
    }
}
