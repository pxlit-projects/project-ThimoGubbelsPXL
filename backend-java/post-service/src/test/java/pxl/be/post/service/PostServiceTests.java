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
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.domain.Post;
import pxl.be.post.repository.PostRepository;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

@SpringBootTest
@Testcontainers
public class PostServiceTests {

    @Container
    private static MySQLContainer sqlContainer = new MySQLContainer("mysql:5.7.37");

    @Autowired
    private PostService postService;

    @Autowired
    private PostRepository postRepository;

    @MockBean
    private PostRepository mockPostRepository;


    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        postRepository.deleteAll();
    }

    @Test
    public void testCreatePostShouldInvokeRepositorySave() {
        //Assemble
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Test Post")
                .content("This is a test post.")
                .author("Author")
                .date(new Date())
                .build();

        Post post = Post.builder()
                .title(createPostRequest.getTitle())
                .content(createPostRequest.getContent())
                .author(createPostRequest.getAuthor())
                .date(createPostRequest.getDate())
                .build();
        //Act
        postService.createPost(createPostRequest);
        //Assert
        Mockito.verify(mockPostRepository).save(post);
    }

    @Test
    public void testCreatePostIntegration() {
        //Assemble
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Test Post")
                .content("This is a test post.")
                .author("Author")
                .date(new Date())
                .build();
        //Act
        postService.createPost(createPostRequest);
        //Assert
        assertEquals(1, postRepository.findAll().size());
    }
}