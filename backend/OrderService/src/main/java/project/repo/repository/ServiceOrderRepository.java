package project.repo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.repo.entity.ServiceOrder;

@Repository
public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Long> {
  List<ServiceOrder> findByCenterId(Long centerId);
    List<ServiceOrder> findByTechnicianId(Long technicianId);
    List<ServiceOrder> findByVehicleId(Long vehicleId);
}
