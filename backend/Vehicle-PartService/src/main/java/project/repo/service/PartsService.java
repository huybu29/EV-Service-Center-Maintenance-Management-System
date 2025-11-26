package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import project.repo.entity.Parts;
import project.repo.mapper.PartsMapper;
import project.repo.repository.PartRepository;
import project.repo.dtos.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
@Service
@RequiredArgsConstructor
@Transactional
public class PartsService {

    private final PartRepository partsRepository;
    private final PartsMapper partsMapper;

    public PartsDTO create(PartsDTO dto) {
        Parts part = partsMapper.toEntity(dto);
        part.setCreatedAt(LocalDateTime.now());
        part.setUpdatedAt(LocalDateTime.now());
        Parts saved = partsRepository.save(part);
        return partsMapper.toDto(saved);
    }

    public List<PartsDTO> findAll() {
        return partsRepository.findAll().stream()
                .map(partsMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<PartsDTO> searchParts(String keyword) {
        return partsRepository.findByPartNameContainingIgnoreCaseOrPartCodeContainingIgnoreCase(keyword, keyword)
                .stream()
                .map(partsMapper::toDto)
                .collect(Collectors.toList());
    }

    public PartsDTO findById(Long id) {
        return partsRepository.findById(id)
                .map(partsMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Part not found with id: " + id));
    }

    public PartsDTO updatePartByRole(Long id, PartsDTO dto, String role) {
        Parts part = partsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Part not found"));

        if ("ROLE_ADMIN".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role)) {
            part.setPartCode(dto.getPartCode());
            part.setPartName(dto.getPartName());
            part.setCategory(dto.getCategory());
            part.setDescription(dto.getDescription());
            part.setUnit(dto.getUnit());
            part.setPrice(dto.getPrice());
            part.setQuantity(dto.getQuantity());
            part.setStatus(dto.getStatus());
            part.setMinQuantity(dto.getMinQuantity());
        } else if ("ROLE_STAFF".equalsIgnoreCase(role) || "STAFF".equalsIgnoreCase(role)) {
            part.setQuantity(dto.getQuantity());
            part.setMinQuantity(dto.getMinQuantity());
        } else {
            throw new RuntimeException("Access denied: You do not have permission to update this part.");
        }

        part.setUpdatedAt(LocalDateTime.now());
        return partsMapper.toDto(partsRepository.save(part));
    }

    public void delete(Long id) {
        if (!partsRepository.existsById(id)) {
            throw new RuntimeException("Part not found");
        }
        partsRepository.deleteById(id);
    }

    @Transactional
    public PartsDTO decreaseQuantity(Long partId, int amount) {
        Parts part = partsRepository.findById(partId)
                .orElseThrow(() -> new RuntimeException("Part not found"));

        if (part.getQuantity() == null || part.getQuantity() < amount) {
            throw new RuntimeException(
                    "Insufficient stock. Current: " + (part.getQuantity() == null ? 0 : part.getQuantity()) + ", Required: " + amount
            );
        }

        part.setQuantity(part.getQuantity() - amount);
        part.setUpdatedAt(LocalDateTime.now());

        Parts saved = partsRepository.save(part);
        return partsMapper.toDto(saved);
    }
   
    public PartsDTO getSuggestedPartByTask(String taskName) {
        if (taskName == null) return null;
        
        String task = taskName.toLowerCase(); 
        String targetSku = null;

        if (task.contains("lọc gió điều hòa")) {
            targetSku = "FIL-AIR-VF8";
        } 
        else if (task.contains("gạt mưa")) {
            targetSku = "WIP-SET-GEN";
        } 
        else if (task.contains("nước làm mát")) {
            targetSku = "LIQ-COOL-EV";
        }
        else if (task.contains("lốp xe")) {
            
        }
        
        
        else if (task.contains("cổng sạc") && task.contains("tình trạng")) {
            targetSku = "CHG-CAP-01"; // Nắp bảo vệ
        }
        else if (task.contains("khóa súng sạc")) { 
            targetSku = "CHG-LCK-ACT";
        }
        
        else if (task.contains("bình 12v") || task.contains("ắc quy")) {
            targetSku = "BAT-12V-45AH";
        }

        else if (task.contains("má phanh")) {
            targetSku = "BRK-PAD-CER";
        }
        else if (task.contains("dầu phanh")) {
            targetSku = "OIL-DOT4-500";
        }
        else if (task.contains("cảm biến báo mòn")) {
            targetSku = "SEN-BRK-WR";
        }

       
        if (targetSku != null) {
            return partsRepository.findByPartCode(targetSku)
                    .map(partsMapper::toDto)
                    .orElse(null);
        }
        return null; 
    }
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void updateAiForecast(PartForecastDTO dto) {
        
        // 1. Lấy partCode từ trong DTO
        String code = dto.getPartCode();
        
        if (code == null || code.isEmpty()) {
            throw new RuntimeException("Part Code is missing in AI request");
        }

        // 2. Tìm phụ tùng
        Parts part = partsRepository.findByPartCode(code)
                .orElseThrow(() -> new RuntimeException("Part not found: " + code));

        try {
            // 3. Chuyển DTO thành chuỗi JSON để lưu vào DB
            String jsonResult = objectMapper.writeValueAsString(dto);
            
            part.setAiForecast(jsonResult);
            partsRepository.save(part);
            
            System.out.println("✅ Đã cập nhật dự báo AI cho: " + code);
        } catch (Exception e) {
            System.err.println("Lỗi lưu JSON AI: " + e.getMessage());
        }
    }
}