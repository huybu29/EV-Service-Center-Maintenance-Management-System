package project.repo.repository;


import project.repo.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    // Ví dụ: tìm danh sách xe theo customerId
    List<Vehicle> findByCustomerId(Long customerId);

    
    List<Vehicle> findByCenterId(Long centerId);

}
