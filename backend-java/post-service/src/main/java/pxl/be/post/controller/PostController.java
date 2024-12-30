package pxl.be.post.controller;

import jakarta.validation.Valid;
import jakarta.ws.rs.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.PostResponse;
import pxl.be.post.api.data.PublicPostResponse;
import pxl.be.post.exception.UnAuthorizedException;
import pxl.be.post.service.IPostService;

import java.util.Date;

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

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity getAllPosts(){
        log.info("Getting all posts");
        log.debug("Getting all posts");

        return new ResponseEntity(postService.getAllPosts(), HttpStatus.OK);
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

    @GetMapping("/filter")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Page<PublicPostResponse>> filterPosts(
            @RequestParam(required = false) String content,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) Date startDate,
            @RequestParam(required = false) Date endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Filtering posts");
        log.debug("Filtering posts with content: {}, author: {}, startDate: {}, endDate: {}", content, author, startDate, endDate);
        Pageable pageable = PageRequest.of(page, size);
        return new ResponseEntity<>(postService.filterPosts(content, author, startDate, endDate, pageable), HttpStatus.OK);
    }
}
