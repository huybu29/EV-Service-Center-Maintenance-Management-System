package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.repo.entity.Order;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    
    Order findByAppointmentId(Long appointmentId);

  
    List<Order> findByTechnicianId(Long technicianId);

 
    List<Order> findByStatus(Order.OrderStatus status);
}
