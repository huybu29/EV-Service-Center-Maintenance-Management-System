package project.repo.config;

import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import org.springframework.http.server.reactive.ServerHttpRequest;
@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    // 🔐 Khóa bí mật (ít nhất 32 bytes ~ 256 bit)
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(
            "ThisIsA32ByteLongSecretKeyForJWTs123456!!!".getBytes(StandardCharsets.UTF_8)
    );

    public JwtAuthFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
    return (exchange, chain) -> {
      
        ServerHttpRequest request = exchange.getRequest().mutate()
                .headers(httpHeaders -> {
                    httpHeaders.remove("X-User-Id");
                    httpHeaders.remove("X-User-Role");
                    httpHeaders.remove("X-User-Station-Id");
                })
                .build();

      
        ServerWebExchange mutatedExchange = exchange.mutate().request(request).build();

        String authHeader = request.getHeaders().getFirst("Authorization");

      
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return chain.filter(mutatedExchange);
        }

        String token = authHeader.substring(7);

        try {
            // ✅ Parse và xác thực JWT
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Object userIdObj = claims.get("userId");
            Object roleObj = claims.get("role");
            Object stationIdObj = claims.get("stationId");

            
            ServerHttpRequest.Builder requestBuilder = mutatedExchange.getRequest().mutate();

            if (userIdObj != null) {
                requestBuilder.header("X-User-Id", String.valueOf(userIdObj));
            }

            if (roleObj != null) {
                requestBuilder.header("X-User-Role", String.valueOf(roleObj));
            }
            
            if (stationIdObj != null) {
                requestBuilder.header("X-User-Station-Id", String.valueOf(stationIdObj));
            }

           
            mutatedExchange = mutatedExchange.mutate().request(requestBuilder.build()).build();

        } catch (Exception e) {
            System.out.println("❌ Invalid JWT: " + e.getMessage());
            
        }

        return chain.filter(mutatedExchange);
    };
}

    public static class Config {}
}
