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
import pxl.be.post.domain.Post;
import pxl.be.post.exception.ResourceNotFoundException;
import pxl.be.post.repository.PostRepository;

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
        "spring.jpa.hibernate.ddl-auto=create"
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
    public void testGetAllPostsIntegration() {
        // Assemble
        Post post1 = Post.builder()
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .build();

        Post post2 = Post.builder()
                .title("Post 2")
                .content("Content 2")
                .author("Author 2")
                .date(new Date())
                .build();

        postRepository.save(post1);
        postRepository.save(post2);

        // Act
        List<PostResponse> postResponses = postService.getAllPosts();

        // Assert
        assertEquals(2, postResponses.size());
        assertEquals("Post 1", postResponses.get(0).getTitle());
        assertEquals("Post 2", postResponses.get(1).getTitle());
    }

}
