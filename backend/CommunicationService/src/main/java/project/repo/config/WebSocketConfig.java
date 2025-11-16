package project.repo.config; // (Đổi package)

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // Kích hoạt WebSocket
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Đây là endpoint để client React kết nối (ví dụ: /ws)
        // .withSockJS() là BẮT BUỘC để xử lý lỗi CORS khi chạy trên 2 port khác nhau
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // "Broker" (nơi lắng nghe): Client sẽ SUB (đăng ký) vào các topic bắt đầu bằng /topic
        // Ví dụ: /topic/public-chat
        registry.enableSimpleBroker("/topic");
        
        // "Application" (nơi gửi): Client sẽ GỬI (send) tin nhắn đến các đích bắt đầu bằng /app
        // Ví dụ: /app/chat.sendMessage
        registry.setApplicationDestinationPrefixes("/app");
    }
}