package project.repo.dtos;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.Builder;
import java.lang.Integer;
@Builder
@Data
public class PaymentDto {
  private Long paymentID;
  private Long userID;
  private String invoiceNumber;
  private Long bookingID;
  private Integer amount;
  private String status;
  private String method ;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  }

