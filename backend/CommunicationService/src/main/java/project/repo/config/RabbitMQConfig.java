package project.repo.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // 1. Tên Exchange chung cho toàn hệ thống thông báo
    public static final String EXCHANGE_NAME = "notification_exchange";
    
    // 2. Tên Queue của Service này
    public static final String QUEUE_NAME = "notification_queue";
    
    // 3. Routing Key: Dùng dấu # để nhận TẤT CẢ các loại thông báo
    // (notification.booking, notification.order, notification.general...)
    public static final String ROUTING_KEY = "notification.#"; 

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue queue() {
        // true: Bền vững (Durable) - Không bị mất khi restart RabbitMQ
        // Lưu ý: Nếu trước đó queue này là false, bạn phải vào RabbitMQ Manager xóa nó đi trước
        return new Queue(QUEUE_NAME, true); 
    }

    @Bean
    public Binding binding(Queue queue, TopicExchange exchange) {
        // Binding với key "notification.#" để hứng mọi tin nhắn bắt đầu bằng "notification."
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}