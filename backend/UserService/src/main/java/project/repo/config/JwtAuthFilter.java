package project.repo.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import project.repo.service.UserService;
import project.repo.service.JwtService;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain)
        throws ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");
    final String jwt;
    final String username;

    // 🔹 Không có header hoặc header không bắt đầu bằng Bearer => bỏ qua
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }

    // 🔹 Cắt "Bearer " để lấy token
    jwt = authHeader.substring(7);
    username = jwtService.extractUsername(jwt);

    // ✅ In ra username để debug
    System.out.println("JWT Extracted Username: " + username);

    // 🔹 Nếu có username và chưa được xác thực trước đó
    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        UserDetails userDetails = userService.loadUserByUsername(username);

        // 🔹 Kiểm tra token hợp lệ
        if (jwtService.isTokenValid(jwt, userDetails)) {

            // ✅ Lấy role trực tiếp từ token
            String role = jwtService.extractRole(jwt);

            // ✅ In ra role để debug
            System.out.println("JWT Extracted Role: " + role);
            
            // ✅ Gán quyền xác thực vào context
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" +role);
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails, null, List.of(authority));

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }

    // 🔹 Tiếp tục filter chain
    filterChain.doFilter(request, response);
}}