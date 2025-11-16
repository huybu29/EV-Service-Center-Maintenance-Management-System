package project.repo.config; // (Đổi package cho đúng)

import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
@Configuration
public class RabbitMQConfig {

    /**
     * Tên của Exchange (nơi phát).
     * Tất cả service (publisher và subscriber) sẽ dùng chung tên này.
     */
    public static final String EXCHANGE_NAME = "booking_exchange"; // Đổi tên

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
} 
  

