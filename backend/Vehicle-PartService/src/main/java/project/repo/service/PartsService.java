package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.PartsDTO;
import project.repo.entity.Parts;
import project.repo.mapper.PartsMapper;
import project.repo.repository.PartRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PartsService {

    private final PartRepository partsRepository;
    private final PartsMapper partsMapper;

    // 🔹 Tạo mới linh kiện
    public PartsDTO create(PartsDTO dto) {
        Parts part = partsMapper.toEntity(dto);
        part.setCreatedAt(LocalDateTime.now());
        part.setUpdatedAt(LocalDateTime.now());
        Parts saved = partsRepository.save(part);
        return partsMapper.toDto(saved);
    }

    // Trừ số lượng phụ tùng
    @Transactional
    public PartsDTO decreaseQuantity(Long partId, int amount) {
        Parts part = partsRepository.findById(partId)
                .orElseThrow(() -> new RuntimeException("Phụ tùng không tồn tại"));

        if (part.getQuantity() == null || part.getQuantity() < amount) {
            throw new RuntimeException(
                    "Không thể trừ phụ tùng. Số lượng tồn hiện tại: " + (part.getQuantity() == null ? 0 : part.getQuantity())
            );
        }

        part.setQuantity(part.getQuantity() - amount);
        part.setUpdatedAt(LocalDateTime.now());

        Parts saved = partsRepository.save(part);
        return partsMapper.toDto(saved);
    }

    // Optional: kiểm tra stock trước khi trừ
    public boolean canDecrease(Long partId, int amount) {
        return partsRepository.findById(partId)
                .map(p -> p.getQuantity() != null && p.getQuantity() >= amount)
                .orElse(false);
    }

    // 🔹 Lấy tất cả linh kiện
    public List<PartsDTO> findAll() {
        return partsRepository.findAll()
                .stream()
                .map(partsMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Lấy linh kiện theo ID
    public PartsDTO findById(Long id) {
        return partsRepository.findById(id)
                .map(partsMapper::toDto)
                .orElse(null);
    }

    // 🔹 Cập nhật linh kiện
    public PartsDTO update(Long id, PartsDTO dto) {
        return partsRepository.findById(id)
                .map(existing -> {
                    existing.setPartCode(dto.getPartCode());
                    existing.setPartName(dto.getPartName());
                    existing.setCategory(dto.getCategory());
                    existing.setDescription(dto.getDescription());
                    existing.setUnit(dto.getUnit());
                    existing.setPrice(dto.getPrice());
                    existing.setQuantity(dto.getQuantity());
                    existing.setStatus(dto.getStatus());
                    existing.setMinQuantity(dto.getMinQuantity());
                    existing.setUpdatedAt(LocalDateTime.now());
                    return partsMapper.toDto(partsRepository.save(existing));
                })
                .orElse(null);
    }

    // 🔹 Xóa linh kiện
    public void delete(Long id) {
        partsRepository.deleteById(id);
    }
}
