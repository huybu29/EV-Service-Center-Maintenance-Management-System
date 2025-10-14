package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.repo.entity.Staff;
import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    // Lấy tất cả nhân viên có role là Technician
    List<Staff> findByRole(String role);
}
