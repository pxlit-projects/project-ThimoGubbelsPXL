package pxl.be.post.configuration;

import com.rabbitmq.client.AMQP;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QueueConfiguration {
    @Bean
    public Queue reviewQueue() {
        return new Queue("reviewAdded", false);
    }

    @Bean
    public Queue commentQueue() {
        return new Queue("comment", false);
    }
}
