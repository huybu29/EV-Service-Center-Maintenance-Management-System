package project.repo.dtos; // (Đổi package)

// DTO này là nội dung tin nhắn được gửi/nhận
public record ChatMessage(
    String sender,
    String content,
    String type // (Ví dụ: "CHAT", "JOIN", "LEAVE")
) {}