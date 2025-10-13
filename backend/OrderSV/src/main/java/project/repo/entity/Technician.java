package project.repo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "technicians")
@Data
public class Technician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String skillLevel;
}
