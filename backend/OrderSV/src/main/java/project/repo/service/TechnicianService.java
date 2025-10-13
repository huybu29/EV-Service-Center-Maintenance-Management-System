package project.repo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.repo.dtos.TechnicianDTO;
import project.repo.entity.Technician;
import project.repo.repository.TechnicianRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TechnicianService {

    @Autowired
    private TechnicianRepository technicianRepository;

    public TechnicianDTO toDTO(Technician t) {
        TechnicianDTO d = new TechnicianDTO();
        d.setId(t.getId());
        d.setName(t.getName());
        d.setPhone(t.getPhone());
        d.setSkillLevel(t.getSkillLevel());
        return d;
    }

    public Technician toEntity(TechnicianDTO d) {
        Technician t = new Technician();
        t.setName(d.getName());
        t.setPhone(d.getPhone());
        t.setSkillLevel(d.getSkillLevel());
        return t;
    }

    public TechnicianDTO create(TechnicianDTO dto) {
        Technician t = toEntity(dto);
        t = technicianRepository.save(t);
        return toDTO(t);
    }

    public TechnicianDTO get(Long id) {
        Technician t = technicianRepository.findById(id).orElseThrow(() -> new RuntimeException("Technician not found"));
        return toDTO(t);
    }

    public List<TechnicianDTO> listAll() {
        return technicianRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }
}
