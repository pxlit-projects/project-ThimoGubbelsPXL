package pxl.be.post.service;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pxl.be.post.api.data.*;
import pxl.be.post.client.CommentClient;
import pxl.be.post.client.ReviewClient;
import pxl.be.post.domain.Post;
import pxl.be.post.exception.ResourceNotFoundException;
import pxl.be.post.repository.PostRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService {
    private final PostRepository postRepository;
    private final ReviewClient reviewClient;
    private final CommentClient commentClient;
    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    public void createPost(CreatePostRequest createPostRequest) {
        Post post = Post.builder()
                .title(createPostRequest.getTitle())
                .content(createPostRequest.getContent())
                .author(createPostRequest.getAuthor())
                .date(createPostRequest.getDate()).build();
        log.debug("Saving post with title: " + post.getTitle());
        postRepository.save(post);
    }

    public void updatePost(Long postId, CreatePostRequest createPostRequest) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post with Id:" + postId + "not found"));
        post.setTitle(createPostRequest.getTitle());
        post.setContent(createPostRequest.getContent());
        post.setConcept(createPostRequest.getIsConcept());


        log.debug("Updating post with id: " + postId);
        postRepository.save(post);
    }
@Transactional
    public void publishPost(Long postId) {
    log.debug("Publishing post with id: " + postId);
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post with Id:" + postId + "not found"));
        post.publish();




        log.info("Post published" + post);
        postRepository.save(post);
    }

    public List<PostResponse> getAllPosts() {
        List<Post> posts = postRepository.findAll();

        return posts.stream().map(this::mapToPostResponse).toList();
    }

    public Page<PublicPostResponse> getAllPublicPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findAll(pageable);
        List<PublicPostResponse> postResponses = posts.stream().filter(Post::isPublished).map(this::mapToPublicPostResponse).collect(Collectors.toList());
        return new PageImpl<>(postResponses, pageable, posts.getTotalElements());
    }

    public Page<PublicPostResponse> filterPosts(String content, String author, Date startDate, Date endDate, Pageable pageable) {
        List<Post> posts = postRepository.findAll();
        List<PublicPostResponse> filteredPosts = posts.stream()
                .filter(post -> (content == null || post.getContent().contains(content)) &&
                        (author == null || post.getAuthor().contains(author)) &&
                        (startDate == null || !post.getDate().before(startDate)) &&
                        (endDate == null || !post.getDate().after(endDate)) && post.isPublished())
                .map(this::mapToPublicPostResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(filteredPosts, pageable, filteredPosts.size());
    }

    private PostResponse mapToPostResponse(Post post) {
        PostResponse response = PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .isConcept(post.isConcept())
                .isApproved(post.isApproved())
                .isPublished(post.isPublished())
                .author(post.getAuthor())
                .date(post.getDate()).build();
        log.info("Checking if post has a reviewId "+ post);
        if (post.getReviewId() != null) {
            try {
                log.info("Getting review with id: " + post.getReviewId() + " (type: " + post.getReviewId().getClass().getName() + ")");

                response.setReview(reviewClient.getReview(post.getReviewId()));
                log.info("Review found:  " + response.getReview());
            } catch (FeignException e) {
                log.error("Review with id: " + post.getReviewId() + " not found");
            }
        }
        return response;
    }

    private PublicPostResponse mapToPublicPostResponse(Post post) {
        PublicPostResponse response =  PublicPostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .date(post.getDate()).build();
        if(post.getCommentIds() != null){
            try{
                log.info("Getting comments for post with id: " + post.getId());
                ArrayList<Comment> comments = post.getCommentIds().stream().map(commentClient::getComment).collect(Collectors.toCollection(ArrayList::new));
                response.setComments(comments);
                log.info("Comments found: " + response.getComments());
            }catch (FeignException e){
                log.error("Comments not found for post with id using Open Feign: " + post.getId());
            }
        }
        return response;
    }

@Transactional
    public void updatePostReview(ReviewMessage reviewMessage) {
        log.info("Updating post with reviewId: " + reviewMessage.getReviewId());
        Post post = postRepository.findById(reviewMessage.getPostId()).orElseThrow(() -> new ResourceNotFoundException("Post with Id:" + reviewMessage.getPostId() + "not found"));
        post.setIsApproved(reviewMessage.isApproved());
        post.setReviewId(reviewMessage.getReviewId());
        log.info("Post updated with reviewId: " + post);
        postRepository.save(post);
    }
    @RabbitListener(queues = "comment")
    @Transactional
    public void updateCommentsList(CommentMessage commentMessage) {
        log.info("Updating post with commentId: " + commentMessage.getCommentId());
        Post post = postRepository.findById(commentMessage.getPostId()).orElseThrow(() -> new ResourceNotFoundException("Post with Id:" + commentMessage.getPostId() + "not found"));
        if(commentMessage.isAdded()){
            post.addComment(commentMessage.getCommentId());
        }
       else{
            post.removeComment(commentMessage.getCommentId());
        }
        log.info("Post updated with commentId: " + post);
        postRepository.save(post);
    }


}
