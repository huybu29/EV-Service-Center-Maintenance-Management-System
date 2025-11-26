package project.repo.entity;

import jakarta.persistence.*;
import lombok.*;
import project.repo.entity.Order;
import project.repo.entity.OrderChecklistItem;

@Entity
@Table(name = "order_parts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private Long partId;       
    private String partName;   
    private String partCode;    
    private Integer quantity;
    private Double unitPrice;   
    private Double subTotal;   


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checklist_item_id") // Tên cột trong database
    private OrderChecklistItem checklistItem;
}