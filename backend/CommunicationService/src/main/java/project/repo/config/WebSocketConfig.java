package project.repo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Principal;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(
            "ThisIsA32ByteLongSecretKeyForJWTs123456!!!".getBytes(StandardCharsets.UTF_8)
    );

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-notification") // Hoặc "/ws" tùy bạn thống nhất
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/user", "/topic");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);
                        try {
                            Claims claims = Jwts.parserBuilder()
                                    .setSigningKey(SECRET_KEY)
                                    .build()
                                    .parseClaimsJws(token)
                                    .getBody();

                            String userId = String.valueOf(claims.get("userId"));

                            if (userId != null) {
                                // ✅ SỬA TẠI ĐÂY: Dùng StompPrincipal tự tạo thay vì UsernamePasswordAuthenticationToken
                                Principal userPrincipal = new StompPrincipal(userId);
                                accessor.setUser(userPrincipal);
                            }
                        } catch (Exception e) {
                            // Token lỗi
                        }
                    }
                }
                return message;
            }
        });
    }

    // ✅ CLASS CON TỰ ĐỊNH NGHĨA (Nằm trong cùng file hoặc tách ra đều được)
    class StompPrincipal implements Principal {
        private final String name;

        public StompPrincipal(String name) {
            this.name = name;
        }

        @Override
        public String getName() {
            return name;
        }
    }
}