package project.repo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import project.repo.dtos.LowStockAlertDTO;
import project.repo.entity.LowStockAlert;

@Mapper(componentModel = "spring")
public interface LowStockAlertMapper {

    @Mappings({
        @Mapping(source = "part.partId", target = "partId"),
        @Mapping(source = "part.partCode", target = "partCode"),
        @Mapping(source = "part.partName", target = "partName")
    })
    LowStockAlertDTO toDto(LowStockAlert alert);

    @Mappings({
        @Mapping(source = "partId", target = "part.partId"),
        @Mapping(target = "part.partCode", ignore = true),
        @Mapping(target = "part.partName", ignore = true)
    })
    LowStockAlert toEntity(LowStockAlertDTO dto);
}
