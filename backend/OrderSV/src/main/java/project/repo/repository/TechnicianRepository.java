package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.repo.entity.Technician;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {
}
