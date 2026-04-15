package project.repo.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import project.repo.entity.User;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
@Service
public class JwtService {

    // 🔑 Khóa bí mật — PHẢI giống 100% với khóa ở Gateway
    private static final String SECRET = "ThisIsA32ByteLongSecretKeyForJWTs123456!!!"; // 32 bytes

    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    @Value("${jwt.expiration:3600000}") // 1 giờ mặc định
    private long EXPIRATION;

    // 🔹 Tạo token (lưu username + role + userId)
    public String generateToken(User user) {
        long now = System.currentTimeMillis();
        System.out.println("Generating JWT for user: " + user.getUsername() + ", role: " + user.getRole() + ", userId: " + user.getId());
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole())
                .claim("userId", user.getId())
                .claim("stationId", user.getStationId())
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + EXPIRATION))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // 🔹 Giải mã token và lấy userId
    public Long extractUserId(String token) {
        Claims claims = parseToken(token);
        return claims.get("userId", Long.class);
    }

    // 🔹 Giải mã token và lấy username
    public String extractUsername(String token) {
        Claims claims = parseToken(token);
        return claims.getSubject();
    }

    // 🔹 Lấy role từ token
    public String extractRole(String token) {
        Claims claims = parseToken(token);
        return claims.get("role", String.class);
    }

    // 🔹 Kiểm tra token hợp lệ
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // 🔹 Kiểm tra token hết hạn
    private boolean isTokenExpired(String token) {
        Claims claims = parseToken(token);
        return claims.getExpiration().before(new Date());
    }
    public boolean isTokenValid(String token, UserDetails userDetails) {
    String username = extractUsername(token);
    return username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token);
}
    // 🔹 Giải mã token (trả về Claims)
    private Claims parseToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT: " + e.getMessage());
        }
    }
}
