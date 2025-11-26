package project.repo.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import project.repo.entity.Parts.PartStatus;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartsDTO {

    private Long partId;          // ID linh kiện
    private String partCode;      // Mã linh kiện
    private String partName;      // Tên linh kiện
    private String category;      // Loại linh kiện
    private String description;   // Mô tả
    private String unit;          // Đơn vị tính
    private Double price;         // Giá tiền
    private Integer quantity;     // Số lượng tồn kho
    private PartStatus status;    // Trạng thái (ACTIVE / INACTIVE)
    private Integer minQuantity;  // Số lượng tối thiểu
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String aiForecast;

}
