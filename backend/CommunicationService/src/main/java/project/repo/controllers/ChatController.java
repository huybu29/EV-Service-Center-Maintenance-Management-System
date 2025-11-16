package project.repo.controller; // (Đổi package)

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import project.repo.dtos.ChatMessage;

@Controller
public class ChatController {

    /**
     * Hàm này sẽ được kích hoạt khi client gửi tin nhắn đến "/app/chat.sendMessage"
     * (Xem WebSocketConfig: /app + /chat.sendMessage)
     */
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public-chat") // Phát (broadcast) tin nhắn này đến TẤT CẢ client
                                 // đang lắng nghe (subscribe) "/topic/public-chat"
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        // Chỉ đơn giản là nhận tin nhắn và phát lại
        System.out.println("Nhận được tin nhắn: " + chatMessage.content());
        return chatMessage;
    }
}