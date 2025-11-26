package project.repo.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
@EnableCaching // Kích hoạt tính năng Caching của Spring
public class RedisConfig {

    /**
     * Cấu hình Cache Manager để quản lý việc lưu trữ cache.
     * @param connectionFactory Factory kết nối Redis (tự động inject từ application.yml)
     * @return RedisCacheManager
     */
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // 1. Cấu hình ObjectMapper để chuyển đổi Object Java sang JSON
        ObjectMapper objectMapper = new ObjectMapper();
        
        // Đăng ký module xử lý ngày tháng (LocalDateTime) của Java 8
        objectMapper.registerModule(new JavaTimeModule());
        
        // Quan trọng: Lưu thông tin class ("@class") vào JSON để khi đọc ra biết nó là Object gì
        // (Giúp tránh lỗi ClassCastException khi deserialize)
        objectMapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );

        // 2. Tạo Serializer dùng Jackson
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer(objectMapper);

        // 3. Cấu hình mặc định cho Cache
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(12)) // Thời gian sống mặc định: 12 giờ
                .disableCachingNullValues()     // Không lưu giá trị NULL vào cache
                
                // Cấu hình Key là String (dễ đọc trong RedisInsight)
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                
                // Cấu hình Value là JSON
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(jsonSerializer));

        // 4. Trả về Manager
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                // Nếu muốn cấu hình riêng cho từng cache name (ví dụ "tokens" sống ngắn hơn)
                // .withCacheConfiguration("tokens", config.entryTtl(Duration.ofMinutes(30))) 
                .build();
    }
}