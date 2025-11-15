package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.repo.entity.OrderChecklistItem;

import java.util.List;

@Repository
public interface OrderChecklistItemRepository extends JpaRepository<OrderChecklistItem, Long> {

   
    List<OrderChecklistItem> findByOrderId(Long orderId);

  
    List<OrderChecklistItem> findByStatus(OrderChecklistItem.ChecklistStatus status);
}
