package project.repo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import project.repo.entity.User;
import project.repo.mapper.UserMapper;
import project.repo.repository.UserRepository;

import project.repo.dtos.UserDTO;

@Service
@RequiredArgsConstructor






public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    // 🔹 Lấy toàn bộ user
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Lấy user theo ID
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userMapper.toDto(user);
    }

    // 🔹 Tạo user mới
    public UserDTO createUser(UserDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = userMapper.toEntity(dto);
        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }

    // 🔹 Tạo tài khoản khách hàng (nhân viên thực hiện)
    public UserDTO createCustomerAccount(UserDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Gán role CUSTOMER
        dto.setRole("ROLE_CUSTOMER");

        // Nếu có trạng thái, mặc định là ACTIVE
        if (dto.getStatus() == null) {
            dto.setStatus("ACTIVE");
        }

        User user = userMapper.toEntity(dto);
        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }

    // 🔹 Cập nhật user
    public UserDTO updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());

        if (dto.getStatus() != null) {
            user.setStatus(User.Status.valueOf(dto.getStatus()));
        }

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(dto.getPassword());
        }

        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }

    // 🔹 Xóa user
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UsernameNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    // 🔹 Lấy danh sách user theo role
    public List<UserDTO> getUsersByRole(String roleName) {
        List<User> users = userRepository.findByRole(roleName);
        return users.stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Xác thực người dùng cho Spring Security
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    
}
