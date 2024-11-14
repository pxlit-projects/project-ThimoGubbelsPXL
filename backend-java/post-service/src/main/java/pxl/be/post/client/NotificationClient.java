package pxl.be.post.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import pxl.be.post.api.data.NotificationRequest;

@FeignClient(name = "notification-service") // -> naam van de service
public interface NotificationClient {

    @PostMapping("/notification")
    void sendNotification(@RequestBody NotificationRequest notifictionRequest);
}
