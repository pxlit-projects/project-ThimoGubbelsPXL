package pxl.be.post.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import pxl.be.post.api.data.NotificationRequest;
import pxl.be.post.api.data.Review;

@FeignClient(name = "review-service") // -> naam van de service
public interface ReviewClient {
    @GetMapping(value="/api/review/{id}",  produces = MediaType.APPLICATION_JSON_VALUE )
    Review getReview(@PathVariable Long id);
}
