package pxl.be.post.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import pxl.be.post.api.data.Comment;
import pxl.be.post.api.data.Review;

@FeignClient(name = "comment-service") // -> naam van de service
public interface CommentClient {
    @GetMapping(value="/api/comment/{id}",  produces = MediaType.APPLICATION_JSON_VALUE )
    Comment getComment(@PathVariable Long id);
}
