package pxl.be.post.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.EmployeeResponse;
import pxl.be.post.controller.PostController;
import pxl.be.post.domain.Employee;
import pxl.be.post.domain.Post;
import pxl.be.post.repository.PostRepository;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;
    private static final Logger log = LoggerFactory.getLogger(PostController.class);

    public void createPost(CreatePostRequest createPostRequest){
        Post post = Post.builder()
                .title(createPostRequest.getTitle())
                .content(createPostRequest.getContent())
                .author(createPostRequest.getAuthor())
                .date(createPostRequest.getDate()).build();
        log.info("Saving post");
        postRepository.save(post);
    }


}
