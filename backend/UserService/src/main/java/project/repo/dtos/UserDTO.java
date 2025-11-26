package project.repo.dtos;

import java.time.LocalDateTime;

import lombok.*;
import java.io.Serializable;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO implements Serializable{
    private static final long serialVersionUID = 1L;
    private Long id;
    private String username;
    private String fullName;
    private String password;
    private String email;
    private String phone;
    private String role;
    private String status;   // ACTIVE, INACTIVE
    private LocalDateTime createdAt;
    private Long stationId;
    private String staffStatus;
}
