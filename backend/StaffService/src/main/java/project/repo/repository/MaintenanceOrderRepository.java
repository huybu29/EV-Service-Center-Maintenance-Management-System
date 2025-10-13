package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.MaintenanceOrder;

public interface MaintenanceOrderRepository extends JpaRepository<MaintenanceOrder, Long> {
}
