package project.repo.dtos;

import lombok.*;
import project.repo.dtos.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long id;
    private Long appointmentId;

    // --- INPUT FIELDS (Dùng khi tạo/update) ---
    // Khi Frontend gửi lên để tạo đơn, họ chỉ cần gửi ID
    private Long technicianId;
    private Long vehicleId;
    private Long customerId;

    
    private UserDTO customer;
    private VehicleDTO vehicle;

    // --- THÔNG TIN CHUNG ---
    private Double totalCost;
    private String status; // OrderStatus enum string
    private String notes;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String serviceType;

    // Danh sách việc cần làm
    private List<OrderChecklistItemDTO> checklistItems;
}