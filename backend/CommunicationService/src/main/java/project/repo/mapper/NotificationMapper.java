package project.repo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.repo.dtos.NotificationDTO;
import project.repo.entity.Notification;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    
    Notification toEntity(NotificationDTO dto);

    NotificationDTO toDto(Notification entity);
}
