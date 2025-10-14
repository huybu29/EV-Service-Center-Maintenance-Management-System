package project.repo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.repo.entity.Parts;

@Repository
public interface PartRepository extends JpaRepository<Parts, Long> {
    
    // Tìm kiếm phụ tùng theo mã
    Parts findByPartCode(String partCode);

    // Tìm tất cả phụ tùng có số lượng nhỏ hơn hoặc bằng mức tối thiểu
    List<Parts> findByQuantityLessThanEqual(Integer minQuantity);
}
