package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.repo.entity.ServiceChecklist;

@Repository
public interface ServiceChecklistRepository extends JpaRepository<ServiceChecklist, Long> {
}
