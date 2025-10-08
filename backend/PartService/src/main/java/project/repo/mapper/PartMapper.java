package project.repo.mapper;

import org.mapstruct.Mapper;
import project.repo.dtos.PartDTO;
import project.repo.entity.Parts;

@Mapper(componentModel = "spring")
public interface PartMapper {
    PartDTO toDto(Parts part);
    Parts toEntity(PartDTO dto);
}
