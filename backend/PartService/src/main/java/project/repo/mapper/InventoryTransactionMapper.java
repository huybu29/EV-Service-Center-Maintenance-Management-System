package project.repo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import project.repo.dtos.InventoryTransactionDTO;
import project.repo.entity.InventoryTransaction;

@Mapper(componentModel = "spring")
public interface InventoryTransactionMapper {

    @Mappings({
        @Mapping(source = "part.partId", target = "partId"),
        @Mapping(source = "part.partCode", target = "partCode"),
        @Mapping(source = "part.partName", target = "partName")
    })
    InventoryTransactionDTO toDto(InventoryTransaction transaction);

    @Mappings({
        @Mapping(source = "partId", target = "part.partId"),
        @Mapping(target = "part.partCode", ignore = true),
        @Mapping(target = "part.partName", ignore = true)
    })
    InventoryTransaction toEntity(InventoryTransactionDTO dto);
}
