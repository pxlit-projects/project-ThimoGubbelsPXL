package pxl.be.post.service;

import feign.FeignException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import pxl.be.post.api.data.*;
import pxl.be.post.client.CommentClient;
import pxl.be.post.client.ReviewClient;
import pxl.be.post.domain.Post;
import pxl.be.post.exception.ResourceNotFoundException;
import pxl.be.post.repository.PostRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PostServiceTests {

    @InjectMocks
    private PostService postService;

    @Mock
    private PostRepository mockPostRepository;

    @Mock
    private ReviewClient mockReviewClient;

    @Mock
    private CommentClient mockCommentClient;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreatePostShouldInvokeRepositorySave() {
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Test Post")
                .content("This is a test post.")
                .author("Author")
                .date(new Date())
                .build();

        postService.createPost(createPostRequest);

        verify(mockPostRepository).save(any(Post.class));
    }

    @Test
    public void testUpdatePostShouldInvokeRepositorySaveAndReviewClientDelete() {
        Long postId = 1L;
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Updated Post")
                .content("This is an updated post.")
                .author("Author")
                .date(new Date())
                .isConcept(true)
                .build();

        Post existingPost = Post.builder()
                .id(postId)
                .title("Old Post")
                .content("This is an old post.")
                .author("Author")
                .date(new Date())
                .reviewId(1L)
                .build();

        when(mockPostRepository.findById(postId)).thenReturn(Optional.of(existingPost));

        postService.updatePost(postId, createPostRequest);

        assertEquals("Updated Post", existingPost.getTitle());
        assertEquals("This is an updated post.", existingPost.getContent());
        assertTrue(existingPost.isConcept());
        verify(mockPostRepository).save(existingPost);
        verify(mockReviewClient).deleteReview(1L);
    }

    @Test
    public void testUpdatePostShouldThrowResourceNotFoundException() {
        Long postId = 1L;
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Updated Post")
                .content("This is an updated post.")
                .author("Author")
                .date(new Date())
                .isConcept(true)
                .build();

        when(mockPostRepository.findById(postId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> postService.updatePost(postId, createPostRequest));
    }




    @Test
    public void testGetAllPublicPostsShouldInvokeCommentClient() {
        Post post = Post.builder()
                .id(1L)
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .isPublished(true)
                .commentIds(List.of(1L))
                .build();

        Comment comment = Comment.builder()
                .id(1L)
                .content("Comment Content")
                .author("Comment Author")
                .build();

        when(mockPostRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(List.of(post)));
        when(mockCommentClient.getComment(1L)).thenReturn(comment);

        Pageable pageable = PageRequest.of(0, 10);
        Page<PublicPostResponse> publicPosts = postService.getAllPublicPosts(pageable);

        assertEquals(1, publicPosts.getTotalElements());
        assertEquals("Post 1", publicPosts.getContent().get(0).getTitle());
        assertEquals("Comment Content", publicPosts.getContent().get(0).getComments().get(0).getContent());
        verify(mockCommentClient).getComment(1L);
    }

    @Test
    public void testGetAllPublicPostsShouldReturnPublicPosts() {
        Post post1 = Post.builder()
                .id(1L)
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .isPublished(true)
                .commentIds(new ArrayList<>())
                .build();

        Post post2 = Post.builder()
                .id(2L)
                .title("Post 2")
                .content("Content 2")
                .author("Author 2")
                .date(new Date())
                .isPublished(false)
                .commentIds(new ArrayList<>())
                .build();

        when(mockPostRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(List.of(post1, post2)));

        Pageable pageable = PageRequest.of(0, 10);
        Page<PublicPostResponse> publicPosts = postService.getAllPublicPosts(pageable);

        assertEquals(1, publicPosts.getTotalElements());
        assertEquals("Post 1", publicPosts.getContent().get(0).getTitle());
    }

    @Test
    public void testUpdatePostReviewShouldInvokeRepositorySave() {
        ReviewMessage reviewMessage = ReviewMessage.builder()
                .postId(1L)
                .reviewId(1L)
                .isApproved(true)
                .build();

        Post existingPost = Post.builder()
                .id(1L)
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .build();

        when(mockPostRepository.findById(1L)).thenReturn(Optional.of(existingPost));

        postService.updatePostReview(reviewMessage);

        assertEquals(1L, existingPost.getReviewId());
        assertTrue(existingPost.isApproved());
        verify(mockPostRepository).save(existingPost);
    }

    @Test
    public void testUpdatePostReviewShouldThrowResourceNotFoundException() {
        ReviewMessage reviewMessage = ReviewMessage.builder()
                .postId(1L)
                .reviewId(1L)
                .isApproved(true)
                .build();

        when(mockPostRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> postService.updatePostReview(reviewMessage));
    }

    @Test
    public void testUpdateCommentsListShouldAddComment() {
        CommentMessage commentMessage = CommentMessage.builder()
                .postId(1L)
                .commentId(1L)
                .isAdded(true)
                .build();

        Post existingPost = Post.builder()
                .id(1L)
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .commentIds(new ArrayList<>())
                .build();

        when(mockPostRepository.findById(1L)).thenReturn(Optional.of(existingPost));

        postService.updateCommentsList(commentMessage);

        assertTrue(existingPost.getCommentIds().contains(1L));
        verify(mockPostRepository).save(existingPost);

    }

    @Test
    public void testUpdateCommentsListShouldRemoveComment() {
        CommentMessage commentMessage = CommentMessage.builder()
                .postId(1L)
                .commentId(1L)
                .isAdded(false)
                .build();

        Post existingPost = Post.builder()
                .id(1L)
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .commentIds(new ArrayList<>(List.of(1L)))
                .build();

        when(mockPostRepository.findById(1L)).thenReturn(Optional.of(existingPost));

        postService.updateCommentsList(commentMessage);

        assertFalse(existingPost.getCommentIds().contains(1L));
        verify(mockPostRepository).save(existingPost);

    }

    @Test
    public void testUpdateCommentsListShouldThrowResourceNotFoundException() {
        CommentMessage commentMessage = CommentMessage.builder()
                .postId(1L)
                .commentId(1L)
                .isAdded(true)
                .build();

        when(mockPostRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> postService.updateCommentsList(commentMessage));
    }
}