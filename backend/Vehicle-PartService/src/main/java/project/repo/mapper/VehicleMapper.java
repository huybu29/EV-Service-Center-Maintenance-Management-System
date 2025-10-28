package project.repo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.repo.dtos.VehicleDTO;
import project.repo.entity.Vehicle;

@Mapper(componentModel = "spring")
public interface VehicleMapper {

    
    Vehicle toEntity(VehicleDTO dto);

    VehicleDTO toDto(Vehicle entity);
}
