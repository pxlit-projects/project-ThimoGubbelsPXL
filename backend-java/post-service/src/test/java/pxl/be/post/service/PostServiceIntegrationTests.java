package pxl.be.post.service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.PostResponse;
import pxl.be.post.api.data.PublicPostResponse;
import pxl.be.post.api.data.ReviewMessage;
import pxl.be.post.domain.Post;
import pxl.be.post.exception.ResourceNotFoundException;
import pxl.be.post.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.*;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
    public void testCreatePostIntegration() {
        // Assemble
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Test Post")
                .content("This is a test post.")
                .author("Author")
                .date(new Date())
                .build();

        // Act
        postService.createPost(createPostRequest);

        // Assert
        assertEquals(1, postRepository.findAll().size());
    }

    @Test
    public void testUpdatePostIntegration() {
        // Assemble
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

        // Act
        postService.updatePost(post.getId(), createPostRequest);

        // Assert
        Post updatedPost = postRepository.findById(post.getId()).orElseThrow();
        assertEquals("Updated Post", updatedPost.getTitle());
        assertEquals("This is an updated post.", updatedPost.getContent());
        assertTrue(updatedPost.isConcept());
    }



    @Test
    public void testFilterPostsIntegration() {
        // Assemble
        Post post1 = Post.builder()
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .isPublished(true)
                .build();

        Post post2 = Post.builder()
                .title("Post 2")
                .content("Content 2")
                .author("Author 2")
                .date(new Date())
                .isPublished(false)
                .build();

        postRepository.save(post1);
        postRepository.save(post2);

        // Act
        Pageable pageable = PageRequest.of(0, 10);
        Page<PublicPostResponse> filteredPosts = postService.filterPosts("Content 1", "Author 1", null, null, pageable);

        // Assert
        assertEquals(1, filteredPosts.getTotalElements());
        assertEquals("Post 1", filteredPosts.getContent().get(0).getTitle());
    }

    @Test
    public void testGetAllPublicPostsIntegration() {
        // Assemble
        Post post1 = Post.builder()
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .isPublished(true)
                .build();

        Post post2 = Post.builder()
                .title("Post 2")
                .content("Content 2")
                .author("Author 2")
                .date(new Date())
                .isPublished(false)
                .build();

        postRepository.save(post1);
        postRepository.save(post2);

        // Act
        Pageable pageable = PageRequest.of(0, 10);
        Page<PublicPostResponse> publicPosts = postService.getAllPublicPosts(pageable);

        // Assert
        assertEquals(1, publicPosts.getTotalElements());
        assertEquals("Post 1", publicPosts.getContent().get(0).getTitle());
    }

    @Test
    public void testPublishPostIntegration() {
        // Assemble
        Post post = Post.builder()
                .title("Old Post")
                .content("This is an old post.")
                .author("Author")
                .date(new Date())
                .isApproved(true) // Ensure the post is approved
                .build();
        postRepository.save(post);

        // Act
        postService.publishPost(post.getId());

        // Assert
        Post publishedPost = postRepository.findById(post.getId()).orElseThrow();
        assertTrue(publishedPost.isPublished());
    }

    @Test
    public void testPublishPostShouldThrowIllegalStateExceptionIfNotApprovedIntegration() {
        // Assemble
        Post post = Post.builder()
                .title("Old Post")
                .content("This is an old post.")
                .author("Author")
                .date(new Date())
                .isApproved(false) // Post is not approved
                .build();
        postRepository.save(post);

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> postService.publishPost(post.getId()));
        assertEquals("Post is not approved", exception.getMessage());
    }

    @Test
    public void testUpdatePostReviewIntegration() {
        // Assemble
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

        // Act
        postService.updatePostReview(reviewMessage);

        // Assert
        Post updatedPost = postRepository.findById(post.getId()).orElseThrow();
        assertEquals(1L, updatedPost.getReviewId());
        assertTrue(updatedPost.isApproved());
    }



}
