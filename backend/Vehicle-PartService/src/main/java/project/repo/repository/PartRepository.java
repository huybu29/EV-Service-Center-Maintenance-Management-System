package project.repo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.repo.entity.Parts;

@Repository
public interface PartRepository extends JpaRepository<Parts, Long> {
    

    List<Parts> findByPartNameContainingIgnoreCaseOrPartCodeContainingIgnoreCase(String partName, String partCode);
    // Tìm tất cả phụ tùng có số lượng nhỏ hơn hoặc bằng mức tối thiểu
    List<Parts> findByQuantityLessThanEqual(Integer minQuantity);
    Optional<Parts> findByPartCode(String partCode);
}
