package project.repo.config; // (Đổi package cho đúng)

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter; // ⭐️ Import
import org.springframework.amqp.support.converter.MessageConverter; // ⭐️ Import
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Phải khớp 100% với Publisher (BookingService)
    public static final String EXCHANGE_NAME = "booking_exchange";
    
    // Tên queue mới cho service này
    public static final String QUEUE_NAME = "notification_queue";
    
    // Routing key để lắng nghe (phải khớp)
    public static final String ROUTING_KEY = "booking.created";

    // 1. Định nghĩa Exchange (giống hệt Publisher)
    @Bean
    TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    // 2. Định nghĩa Queue (hàng đợi) mới
    @Bean
    Queue queue() {
        return new Queue(QUEUE_NAME, false);
    }

    // 3. "Binding" (liên kết) Queue này với Exchange
    @Bean
    Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY);
    }

    // 4. ⭐️ QUAN TRỌNG: Định nghĩa JSON Converter (để đọc tin nhắn)
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}