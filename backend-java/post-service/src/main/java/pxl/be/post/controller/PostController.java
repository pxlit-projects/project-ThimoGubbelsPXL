package pxl.be.post.controller;

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
public class PostController {
    private final IPostService postService;

    private static final Logger log = LoggerFactory.getLogger(PostController.class);


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createPost(@RequestBody  @Validated CreatePostRequest createPostRequest){
        log.info("Creating post");
        log.debug("Creating post");
        postService.createPost(createPostRequest);

    }
}
