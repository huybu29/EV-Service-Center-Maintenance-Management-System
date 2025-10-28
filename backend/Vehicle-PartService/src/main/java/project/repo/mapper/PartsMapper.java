package project.repo.mapper;

import org.mapstruct.Mapper;
import project.repo.dtos.PartsDTO;
import project.repo.entity.Parts;

@Mapper(componentModel = "spring")
public interface PartsMapper {
    PartsDTO toDto(Parts parts);
    Parts toEntity(PartsDTO dto);
}
