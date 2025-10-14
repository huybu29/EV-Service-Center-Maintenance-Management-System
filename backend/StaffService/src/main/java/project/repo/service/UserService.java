package project.repo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import project.repo.dtos.UserDTO;
import project.repo.entity.User;
import project.repo.mapper.UserMapper;
import project.repo.repository.UserRepository;

/**
 * UserService chịu trách nhiệm xử lý nghiệp vụ liên quan đến người dùng.
 * Sử dụng UserMapper để chuyển đổi giữa Entity và DTO.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    // Lấy danh sách tất cả người dùng
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    // Tạo mới người dùng
    public UserDTO createUser(UserDTO dto) {
        User user = userMapper.toUser(dto);
        user.setPassword("{noop}123"); // Mật khẩu mặc định demo
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    // Lấy thông tin người dùng theo ID
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .orElse(null);
    }
}
