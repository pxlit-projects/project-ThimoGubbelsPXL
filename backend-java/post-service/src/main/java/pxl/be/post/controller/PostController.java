package pxl.be.post.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pxl.be.post.api.data.CreatePostRequest;
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
    public void createPost(@Valid @RequestBody CreatePostRequest createPostRequest){
        log.info("Creating post");
        log.info(createPostRequest.toString());
        log.debug("Creating post");
        postService.createPost(createPostRequest);

    }
}
