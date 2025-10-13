package project.repo.dtos;

import lombok.Data;

@Data
public class TechnicianDTO {
    private Long id;
    private String name;
    private String phone;
    private String skillLevel;
}
