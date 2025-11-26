package project.repo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.OrderPart;
import java.util.List;
public interface OrderPartRepository extends JpaRepository<OrderPart, Long> {
    List<OrderPart> findByOrderId(Long orderId);
}
