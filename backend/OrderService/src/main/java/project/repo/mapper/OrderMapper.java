package project.repo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import project.repo.dtos.OrderDTO;
import project.repo.entity.Order;

@Mapper(componentModel = "spring", uses = {OrderChecklistItemMapper.class})
public interface OrderMapper {

    
    OrderDTO toDTO(Order entity);

    Order toEntity(OrderDTO dto);
}
