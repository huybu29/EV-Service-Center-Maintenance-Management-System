package project.repo.mapper;

import project.repo.dtos.ServiceCenterDTO;
import project.repo.entity.ServiceCenter;
import org.mapstruct.Mapper;
@Mapper(componentModel="spring")
public interface ServiceCenterMapper {
    ServiceCenter toEntity(ServiceCenterDTO dto);
   ServiceCenterDTO toDto(ServiceCenter entity);
}
