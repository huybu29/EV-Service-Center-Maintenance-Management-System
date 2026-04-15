package project.repo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

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

            try {
                String token = authHeader.substring(7);
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(SECRET_KEY)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                ServerHttpRequest.Builder requestBuilder = mutatedExchange.getRequest().mutate();

                if (claims.get("userId") != null) requestBuilder.header("X-User-Id", String.valueOf(claims.get("userId")));
                if (claims.get("role") != null) requestBuilder.header("X-User-Role", String.valueOf(claims.get("role")));
                if (claims.get("stationId") != null) requestBuilder.header("X-User-Station-Id", String.valueOf(claims.get("stationId")));

                return chain.filter(mutatedExchange.mutate().request(requestBuilder.build()).build());
            } catch (Exception e) {
                ServerHttpResponse response = exchange.getResponse();
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return response.setComplete();
            }
        };
    }

    public static class Config {}
}