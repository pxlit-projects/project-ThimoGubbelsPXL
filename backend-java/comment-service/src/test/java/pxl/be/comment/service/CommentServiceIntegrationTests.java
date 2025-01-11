package pxl.be.comment.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import pxl.be.comment.api.data.CommentResponse;
import pxl.be.comment.api.data.CreateCommentRequest;
import pxl.be.comment.api.data.UpdateCommentRequest;
import pxl.be.comment.domain.Comment;
import pxl.be.comment.repository.CommentRepository;

import java.util.Date;

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
public class CommentServiceIntegrationTests {

    @Container
    private static MySQLContainer sqlContainer = new MySQLContainer("mysql:5.7.37");

    @Autowired
    private CommentService commentService;

    @Autowired
    private CommentRepository commentRepository;

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @BeforeEach
    public void setUp() {
        commentRepository.deleteAll();
    }



    @Test
    @Transactional
    public void testGetCommentIntegration() {
        Comment comment = Comment.builder()
                .content("Test Comment")
                .author("Author")
                .postId(1L)
                .date(new Date())
                .build();
        commentRepository.save(comment);

        CommentResponse commentResponse = commentService.getComment(comment.getId());

        assertEquals("Test Comment", commentResponse.getContent());
        assertEquals("Author", commentResponse.getAuthor());
    }

    @Test
    @Transactional
    public void testUpdateCommentIntegration() {
        Comment comment = Comment.builder()
                .content("Old Comment")
                .author("Author")
                .postId(1L)
                .date(new Date())
                .build();
        commentRepository.save(comment);

        UpdateCommentRequest updateCommentRequest = UpdateCommentRequest.builder()
                .content("Updated Comment")
                .build();

        CommentResponse commentResponse = commentService.updateComment(comment.getId(), updateCommentRequest);

        assertEquals("Updated Comment", commentResponse.getContent());
        assertEquals("Author", commentResponse.getAuthor());
    }


}