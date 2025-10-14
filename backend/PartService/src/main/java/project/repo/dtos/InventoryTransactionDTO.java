    package project.repo.dtos;

    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import java.time.LocalDateTime;
    import project.repo.entity.InventoryTransaction.TransactionType;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class InventoryTransactionDTO {
        private Long transactionId;
        private Long partId;
        private String partCode;
        private String partName;
        private TransactionType transactionType; // IMPORT or EXPORT
        private Integer quantity;
        private LocalDateTime transactionDate;
    }

