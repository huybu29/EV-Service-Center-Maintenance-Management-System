package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import project.repo.dtos.InventoryTransactionDTO;
import project.repo.entity.InventoryTransaction;
import project.repo.entity.InventoryTransaction.TransactionType;
import project.repo.entity.Parts;
import project.repo.service.InventoryTransactionService;
import project.repo.service.PartService;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class InventoryTransactionController {

    private final InventoryTransactionService transactionService;
    private final PartService partService;

    // Lấy danh sách toàn bộ giao dịch
    @GetMapping
    public ResponseEntity<List<InventoryTransaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    // Lấy giao dịch theo loại (IMPORT hoặc EXPORT)
    @GetMapping("/type/{type}")
    public ResponseEntity<List<InventoryTransaction>> getTransactionsByType(@PathVariable TransactionType type) {
        return ResponseEntity.ok(transactionService.getTransactionsByType(type));
    }

    // Lấy giao dịch theo partId
    @GetMapping("/part/{partId}")
    public ResponseEntity<List<InventoryTransaction>> getTransactionsByPart(@PathVariable Long partId) {
        return partService.getPartById(partId)
                .map(transactionService::getTransactionsByPart)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Ghi giao dịch nhập hoặc xuất kho
    @PostMapping("/record")
    public ResponseEntity<InventoryTransaction> recordTransaction(
            @RequestBody InventoryTransactionDTO dto) {

        Parts part = partService.getPartById(dto.getPartId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ tùng có ID: " + dto.getPartId()));

        InventoryTransaction transaction = transactionService.recordTransaction(part, dto.getTransactionType(), dto.getQuantity());
        return ResponseEntity.ok(transaction);
    }
}
