package project.repo.mapper;

import org.mapstruct.Mapper;
import project.repo.dtos.UserDTO;
import project.repo.entity.User;

/**
 * UserMapper dùng để ánh xạ giữa Entity và DTO.
 * MapStruct sẽ tự động sinh ra lớp UserMapperImpl khi biên dịch.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    // Entity → DTO
    UserDTO toDto(User user);

    // DTO → Entity
    User toUser(UserDTO dto);
}
