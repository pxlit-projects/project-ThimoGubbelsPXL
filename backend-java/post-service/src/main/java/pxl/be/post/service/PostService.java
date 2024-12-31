package pxl.be.post.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.EmployeeResponse;
import pxl.be.post.api.data.PostResponse;
import pxl.be.post.api.data.PublicPostResponse;
import pxl.be.post.controller.PostController;
import pxl.be.post.domain.Employee;
import pxl.be.post.domain.Post;
import pxl.be.post.exception.ResourceNotFoundException;
import pxl.be.post.repository.PostRepository;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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
        post.setConcept(createPostRequest.getIsConcept());


        log.debug("Updating post with id: " + postId);
        postRepository.save(post);
    }

    public List<PostResponse> getAllPosts(){
        List<Post> posts = postRepository.findAll();
        return posts.stream().map(this::mapToPostResponse).toList();
    }

    public Page<PublicPostResponse> getAllPublicPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findAll(pageable);
        List<PublicPostResponse> postResponses = posts.stream().filter(post -> !post.isConcept()).map(this::mapToPublicPostResponse).collect(Collectors.toList());
        return new PageImpl<>(postResponses, pageable, posts.getTotalElements());
    }

    public Page<PublicPostResponse> filterPosts(String content, String author, Date startDate, Date endDate, Pageable pageable) {
        List<Post> posts = postRepository.findAll();
        List<PublicPostResponse> filteredPosts = posts.stream()
                .filter(post -> (content == null || post.getContent().contains(content)) &&
                        (author == null || post.getAuthor().contains(author)) &&
                        (startDate == null || !post.getDate().before(startDate)) &&
                        (endDate == null || !post.getDate().after(endDate)) && !post.isConcept())
                .map(this::mapToPublicPostResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(filteredPosts, pageable, filteredPosts.size());
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
    private PublicPostResponse mapToPublicPostResponse(Post post){
        return PublicPostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .date(post.getDate()).build();
    }


}
