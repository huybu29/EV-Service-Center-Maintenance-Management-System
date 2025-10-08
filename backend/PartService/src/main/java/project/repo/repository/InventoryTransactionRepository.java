package project.repo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.repo.entity.InventoryTransaction;
import project.repo.entity.Parts;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    // Lấy tất cả giao dịch của một phụ tùng
    List<InventoryTransaction> findByPart(Parts part);

    // Tìm theo loại giao dịch (IMPORT hoặc EXPORT)
    List<InventoryTransaction> findByTransactionType(InventoryTransaction.TransactionType type);
}
