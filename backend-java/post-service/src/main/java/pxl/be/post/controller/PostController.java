package pxl.be.post.controller;

import jakarta.validation.Valid;
import jakarta.ws.rs.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.PostResponse;
import pxl.be.post.api.data.PublicPostResponse;
import pxl.be.post.api.data.ReviewMessage;
import pxl.be.post.exception.UnAuthorizedException;
import pxl.be.post.service.IPostService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;

import java.util.Date;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
@Validated
public class PostController {
    private final IPostService postService;

    private static final Logger log = LoggerFactory.getLogger(PostController.class);


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createPost(@RequestHeader(value = "Role", required = true) String headerValue, @Valid @RequestBody CreatePostRequest createPostRequest){
        if(!headerValue.equals("editor")){
            throw new UnAuthorizedException("Unauthorized access");
        }
        log.info("Creating post");
        log.info(createPostRequest.toString());
        log.debug("Creating post");
        postService.createPost(createPostRequest);

    }

    @PutMapping("/{postId}")
    @ResponseStatus(HttpStatus.OK)
    public void updatePost(@RequestHeader(value = "Role", required = true) String headerValue, @PathVariable Long postId, @Valid @RequestBody CreatePostRequest createPostRequest){
        if(!headerValue.equals("editor")){
            throw new UnAuthorizedException("Unauthorized access");
        }
        log.info("Updating post" + createPostRequest.toString());
        log.info(createPostRequest.toString());
        log.debug("Updating post");
        postService.updatePost(postId, createPostRequest);

    }

    @PatchMapping("/{postId}/publish")
    @ResponseStatus(HttpStatus.OK)
    public void publishPost(@RequestHeader(value = "Role", required = true) String headerValue, @PathVariable Long postId){
        if(!headerValue.equals("editor")){
            throw new UnAuthorizedException("Unauthorized access");
        }
        log.info("Publishing post with id: " +postId) ;

        postService.publishPost(postId);

    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity getAllPosts(){
        log.info("Getting all posts");
        log.debug("Getting all posts");

        ResponseEntity  response =new ResponseEntity(postService.getAllPosts(), HttpStatus.OK);
        log.info(response.toString());
        return response;
    }

    @GetMapping("/public")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Page<PublicPostResponse>> getAllPublicPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Getting all public posts");
        log.debug("Getting all posts");
        Pageable pageable = PageRequest.of(page, size);
        return new ResponseEntity<>(postService.getAllPublicPosts(pageable), HttpStatus.OK);
    }




    private final CopyOnWriteArrayList<FluxSink<Object>> subscribers = new CopyOnWriteArrayList<>();

    @GetMapping(value = "/notifications", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Object> streamNotifications() {
        return Flux.create(emitter -> {
                    subscribers.add(emitter);
                    emitter.onDispose(() -> {
                        subscribers.remove(emitter);
                        System.out.println("Client disconnected");
                    });
                })
                .doOnCancel(() -> {
                    System.out.println("Stream cancelled");
                });
    }
    @RabbitListener(queues = "reviewAdded")
    public void sendNotification(ReviewMessage reviewMessage) {
        postService.updatePostReview(reviewMessage);
        for (FluxSink<Object> subscriber : subscribers) {
            subscriber.next(String.format("A post from %s has been reviewed.", reviewMessage.getPostAuthor()));
        }

    }
}
