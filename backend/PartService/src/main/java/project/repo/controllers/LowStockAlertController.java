package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import project.repo.entity.LowStockAlert;
import project.repo.entity.Parts;
import project.repo.service.LowStockAlertService;
import project.repo.service.PartService;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class LowStockAlertController {

    private final LowStockAlertService alertService;
    private final PartService partService;

    // Lấy toàn bộ cảnh báo
    @GetMapping
    public ResponseEntity<List<LowStockAlert>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    // Lấy cảnh báo chưa xử lý
    @GetMapping("/unresolved")
    public ResponseEntity<List<LowStockAlert>> getUnresolvedAlerts() {
        return ResponseEntity.ok(alertService.getUnresolvedAlerts());
    }

    // Tạo cảnh báo mới thủ công (ít khi dùng, nhưng tiện test)
    @PostMapping("/create/{partId}")
    public ResponseEntity<LowStockAlert> createAlert(@PathVariable Long partId) {
        LowStockAlert alert = alertService.createAlert(
                new project.repo.entity.Parts(partId, null, null, null, null, null, null, null, null, null)
        );
        return ResponseEntity.ok(alert);
    }

    // Đánh dấu cảnh báo đã xử lý
    @PutMapping("/resolve/{alertId}")
    public ResponseEntity<Void> resolveAlert(@PathVariable Long alertId) {
        alertService.resolveAlert(alertId);
        return ResponseEntity.noContent().build();
    }

    // ✅ Quét toàn bộ phụ tùng và tạo cảnh báo tự động nếu dưới mức tối thiểu
    @PostMapping("/auto-scan")
public List<LowStockAlert> autoScanLowStock() {
    List<Parts> lowStockParts = partService.getLowStockParts();
    List<LowStockAlert> newAlerts = new ArrayList<>();

    for (Parts part : lowStockParts) {
        LowStockAlert alert = alertService.createAlert(part);
        if (alert != null) newAlerts.add(alert); // tránh add null
    }
    return newAlerts;
}




}
