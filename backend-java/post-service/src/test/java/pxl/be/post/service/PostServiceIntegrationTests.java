package pxl.be.post.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import pxl.be.post.api.data.CommentMessage;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.PublicPostResponse;
import pxl.be.post.api.data.ReviewMessage;
import pxl.be.post.domain.Post;
import pxl.be.post.repository.PostRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
@TestPropertySource(properties = {
        "eureka.client.enabled=false",
        "spring.cloud.discovery.enabled=false",
        "spring.datasource.url=jdbc:mysql://localhost:3310/microservicesDb",
        "spring.datasource.username=user",
        "spring.datasource.password=password",
        "spring.jpa.hibernate.ddl-auto=update"
})
public class PostServiceIntegrationTests {
    @Container
    private static MySQLContainer sqlContainer = new MySQLContainer("mysql:5.7.37");

    @Autowired
    private PostService postService;

    @Autowired
    private PostRepository postRepository;

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @BeforeEach
    public void setUp() {
        postRepository.deleteAll();
    }

    @Test
    @Transactional
    public void testCreatePostIntegration() {
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Test Post")
                .content("This is a test post.")
                .author("Author")
                .date(new Date())
                .build();

        postService.createPost(createPostRequest);

        assertEquals(1, postRepository.findAll().size());
    }

    @Test
    @Transactional
    public void testUpdatePostIntegration() {
        Post post = Post.builder()
                .title("Old Post")
                .content("This is an old post.")
                .author("Author")
                .date(new Date())
                .build();
        postRepository.save(post);

        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Updated Post")
                .content("This is an updated post.")
                .author("Author")
                .date(new Date())
                .isConcept(true)
                .build();

        postService.updatePost(post.getId(), createPostRequest);

        Post updatedPost = postRepository.findById(post.getId()).orElseThrow();
        assertEquals("Updated Post", updatedPost.getTitle());
        assertEquals("This is an updated post.", updatedPost.getContent());
        assertTrue(updatedPost.isConcept());
    }

    @Test
    @Transactional
    public void testGetAllPublicPostsIntegration() {
        Post post1 = Post.builder()
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .isPublished(true)
                .commentIds(new ArrayList<>())
                .build();

        Post post2 = Post.builder()
                .title("Post 2")
                .content("Content 2")
                .author("Author 2")
                .date(new Date())
                .isPublished(false)
                .commentIds(new ArrayList<>())
                .build();

        postRepository.save(post1);
        postRepository.save(post2);

        Pageable pageable = PageRequest.of(0, 10);
        Page<PublicPostResponse> publicPosts = postService.getAllPublicPosts(pageable);

        assertEquals(1, publicPosts.getTotalElements());
        assertEquals("Post 1", publicPosts.getContent().get(0).getTitle());
    }

    @Test
    @Transactional
    public void testPublishPostIntegration() {
        Post post = Post.builder()
                .title("Old Post")
                .content("This is an old post.")
                .author("Author")
                .date(new Date())
                .isApproved(true)
                .build();
        postRepository.save(post);

        postService.publishPost(post.getId());

        Post publishedPost = postRepository.findById(post.getId()).orElseThrow();
        assertTrue(publishedPost.isPublished());
    }

    @Test
    @Transactional
    public void testPublishPostShouldThrowIllegalStateExceptionIfNotApprovedIntegration() {
        Post post = Post.builder()
                .title("Old Post")
                .content("This is an old post.")
                .author("Author")
                .date(new Date())
                .isApproved(false)
                .build();
        postRepository.save(post);

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> postService.publishPost(post.getId()));
        assertEquals("Post is not approved", exception.getMessage());
    }

    @Test
    @Transactional
    public void testUpdatePostReviewIntegration() {
        Post post = Post.builder()
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .build();
        postRepository.save(post);

        ReviewMessage reviewMessage = ReviewMessage.builder()
                .postId(post.getId())
                .reviewId(1L)
                .isApproved(true)
                .build();

        postService.updatePostReview(reviewMessage);

        Post updatedPost = postRepository.findById(post.getId()).orElseThrow();
        assertEquals(1L, updatedPost.getReviewId());
        assertTrue(updatedPost.isApproved());
    }

    @Test
    @Transactional
    public void testUpdateCommentsListShouldAddCommentIntegration() {
        Post post = Post.builder()
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .commentIds(new ArrayList<>())
                .build();
        postRepository.save(post);

        CommentMessage commentMessage = CommentMessage.builder()
                .postId(post.getId())
                .commentId(1L)
                .isAdded(true)
                .build();

        postService.updateCommentsList(commentMessage);

        Post updatedPost = postRepository.findById(post.getId()).orElseThrow();
        assertTrue(updatedPost.getCommentIds().contains(1L));
    }

    @Test
    @Transactional
    public void testUpdateCommentsListShouldRemoveCommentIntegration() {
        Post post = Post.builder()
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .commentIds(new ArrayList<>(List.of(1L)))
                .build();
        postRepository.save(post);

        CommentMessage commentMessage = CommentMessage.builder()
                .postId(post.getId())
                .commentId(1L)
                .isAdded(false)
                .build();

        postService.updateCommentsList(commentMessage);

        Post updatedPost = postRepository.findById(post.getId()).orElseThrow();
        assertFalse(updatedPost.getCommentIds().contains(1L));
    }
}