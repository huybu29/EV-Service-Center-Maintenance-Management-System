package project.repo.dtos;
import lombok.Data;

@Data
public class PartForecastDTO {
    private String partCode;
    private Integer predicted;
    private String reason;
}