package pxl.be.post.controller;

import jakarta.validation.Valid;
import jakarta.ws.rs.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.PostResponse;
import pxl.be.post.exception.UnAuthorizedException;
import pxl.be.post.service.IPostService;

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
        log.info("Updating post");
        log.info(createPostRequest.toString());
        log.debug("Updating post");
        postService.updatePost(postId, createPostRequest);

    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity getAllPosts(){
        log.info("Getting all posts");
        log.debug("Getting all posts");

        return new ResponseEntity(postService.getAllPosts(), HttpStatus.OK);
    }
}
