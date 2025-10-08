package project.repo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.repo.entity.LowStockAlert;
import project.repo.entity.LowStockAlert.AlertStatus;
import project.repo.entity.Parts;

@Repository
public interface LowStockAlertRepository extends JpaRepository<LowStockAlert, Long> {

    // Tìm cảnh báo theo phụ tùng
    List<LowStockAlert> findByPart(Parts part);

    // Tìm cảnh báo theo trạng thái (UNRESOLVED / RESOLVED)
    List<LowStockAlert> findByStatus(AlertStatus status);
}
