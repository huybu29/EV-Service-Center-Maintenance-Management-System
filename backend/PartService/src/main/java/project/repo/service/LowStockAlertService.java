package project.repo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import project.repo.entity.LowStockAlert;
import project.repo.entity.LowStockAlert.AlertStatus;
import project.repo.entity.Parts;
import project.repo.repository.LowStockAlertRepository;

@Service
@RequiredArgsConstructor
public class LowStockAlertService {

    private final LowStockAlertRepository alertRepository;

    // Lấy danh sách tất cả cảnh báo
    public List<LowStockAlert> getAllAlerts() {
        return alertRepository.findAll();
    }

    // Tạo cảnh báo mới khi phụ tùng dưới mức tối thiểu
    public LowStockAlert createAlert(Parts part) {
    return alertRepository.findByPart(part).stream()
        .filter(a -> a.getStatus() == AlertStatus.UNRESOLVED)
        .findFirst()
        .orElseGet(() -> {
            LowStockAlert alert = LowStockAlert.builder()
                    .part(part)
                    .currentQuantity(part.getQuantity())
                    .minQuantity(part.getMinQuantity())
                    .alertMessage("Phụ tùng " + part.getPartName() + " dưới mức tồn kho tối thiểu!")
                    .alertDate(LocalDateTime.now())
                    .status(AlertStatus.UNRESOLVED)
                    .build();
            return alertRepository.save(alert);
        });
}



    // Lấy danh sách cảnh báo chưa xử lý
    public List<LowStockAlert> getUnresolvedAlerts() {
        return alertRepository.findByStatus(AlertStatus.UNRESOLVED);
    }

    // Đánh dấu cảnh báo đã xử lý
    public void resolveAlert(Long alertId) {
        alertRepository.findById(alertId).ifPresent(alert -> {
            alert.setStatus(AlertStatus.RESOLVED);
            alertRepository.save(alert);
        });
    }

    // Kiểm tra và tạo cảnh báo nếu cần
    public void checkAndCreateAlert(Parts part) {
        if (part.getQuantity() <= part.getMinQuantity()) {
            // Kiểm tra xem đã có cảnh báo chưa
            boolean exists = alertRepository.findByPart(part).stream()
                    .anyMatch(a -> a.getStatus() == AlertStatus.UNRESOLVED);
            if (!exists) {
                createAlert(part);
            }
        }
    }
}
