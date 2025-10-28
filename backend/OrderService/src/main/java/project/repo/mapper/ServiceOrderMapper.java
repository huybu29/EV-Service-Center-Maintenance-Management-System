package project.repo.mapper;

import org.mapstruct.Mapper;
import project.repo.dtos.ServiceOrderDTO;
import project.repo.entity.ServiceOrder;

@Mapper(componentModel = "spring")
public interface ServiceOrderMapper {
    ServiceOrderDTO toDto(ServiceOrder entity);
    ServiceOrder toEntity(ServiceOrderDTO dto);
}
