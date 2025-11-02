package project.repo.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import project.repo.dtos.UserDTO;
import project.repo.entity.User;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-13T20:25:59+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDTO toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO userDTO = new UserDTO();

        userDTO.setId( user.getId() );
        userDTO.setUsername( user.getUsername() );
        userDTO.setRole( user.getRole() );

        return userDTO;
    }

    @Override
    public User toUser(UserDTO dto) {
        if ( dto == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.id( dto.getId() );
        user.username( dto.getUsername() );
        user.role( dto.getRole() );

        return user.build();
    }
}
