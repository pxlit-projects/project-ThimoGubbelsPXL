package pxl.be.post.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.EmployeeResponse;
import pxl.be.post.api.data.PostResponse;
import pxl.be.post.controller.PostController;
import pxl.be.post.domain.Employee;
import pxl.be.post.domain.Post;
import pxl.be.post.exception.ResourceNotFoundException;
import pxl.be.post.repository.PostRepository;

import java.util.List;

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
        log.debug("Saving post with title: " + post.getTitle());
        postRepository.save(post);
    }

    public void updatePost(Long postId, CreatePostRequest createPostRequest){
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post with Id:" + postId + "not found"));
        post.setTitle(createPostRequest.getTitle());
        post.setContent(createPostRequest.getContent());


        log.debug("Updating post with id: " + postId);
        postRepository.save(post);
    }

    public List<PostResponse> getAllPosts(){
        List<Post> posts = postRepository.findAll();
        return posts.stream().map(post -> mapToPostResponse(post)).toList();
    }

    private PostResponse mapToPostResponse(Post post){
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .isConcept(post.isConcept())
                .author(post.getAuthor())
                .date(post.getDate()).build();
    }


}
