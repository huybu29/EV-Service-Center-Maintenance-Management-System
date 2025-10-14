package project.repo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import project.repo.entity.Parts;
import project.repo.repository.PartRepository;

@Service
@RequiredArgsConstructor
public class PartService {

    private final PartRepository partRepository;

    // Lấy toàn bộ danh sách phụ tùng
    public List<Parts> getAllParts() {
        return partRepository.findAll();
    }

    // Tìm phụ tùng theo ID
    public Optional<Parts> getPartById(Long id) {
        return partRepository.findById(id);
    }

    // Thêm hoặc cập nhật phụ tùng
    public Parts savePart(Parts part) {
        part.setUpdated(LocalDateTime.now());
        return partRepository.save(part);
    }

    // Xóa phụ tùng
    public void deletePart(Long id) {
        partRepository.deleteById(id);
    }

    // Kiểm tra các phụ tùng có tồn kho thấp hơn mức tối thiểu
    public List<Parts> getLowStockParts() {
    return partRepository.findAll().stream()
        .filter(p -> p.getQuantity() != null && p.getMinQuantity() != null)
        .filter(p -> p.getQuantity() <= p.getMinQuantity())
        .toList();
    }


    // Cập nhật tồn kho sau khi nhập hoặc xuất
    public void updateQuantity(Parts part, int change) {
        int newQuantity = part.getQuantity() + change;
        if (newQuantity < 0) newQuantity = 0;
        part.setQuantity(newQuantity);
        part.setUpdated(LocalDateTime.now());
        partRepository.save(part);
    }
}
