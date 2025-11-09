package project.repo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.repo.dtos.OrderChecklistItemDTO;
import project.repo.entity.OrderChecklistItem;

@Mapper(componentModel = "spring")
public interface OrderChecklistItemMapper {

   
    OrderChecklistItemDTO toDTO(OrderChecklistItem entity);

   
    OrderChecklistItem toEntity(OrderChecklistItemDTO dto);
}
