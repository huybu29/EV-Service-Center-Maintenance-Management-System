package project.repo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import project.repo.entity.InventoryTransaction;
import project.repo.entity.InventoryTransaction.TransactionType;
import project.repo.entity.Parts;
import project.repo.repository.InventoryTransactionRepository;

@Service
@RequiredArgsConstructor
public class InventoryTransactionService {

    private final InventoryTransactionRepository transactionRepository;

    // Lấy tất cả giao dịch
    public List<InventoryTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Lưu giao dịch nhập/xuất kho
    public InventoryTransaction recordTransaction(Parts part, TransactionType type, Integer quantity) {
        if (type == TransactionType.IMPORT) {
            part.setQuantity(part.getQuantity() + quantity);
        } else if (type == TransactionType.EXPORT) {
            part.setQuantity(part.getQuantity() - quantity);
        }
        part.setUpdated(LocalDateTime.now());
        
        InventoryTransaction transaction = InventoryTransaction.builder()
                .part(part)
                .transactionType(type)
                .quantity(quantity)
                .transactionDate(LocalDateTime.now())
                .build();

        return transactionRepository.save(transaction);
    }

    // Lấy giao dịch theo phụ tùng
    public List<InventoryTransaction> getTransactionsByPart(Parts part) {
        return transactionRepository.findByPart(part);
    }

    // Lấy giao dịch theo loại (IMPORT/EXPORT)
    public List<InventoryTransaction> getTransactionsByType(TransactionType type) {
        return transactionRepository.findByTransactionType(type);
    }
}