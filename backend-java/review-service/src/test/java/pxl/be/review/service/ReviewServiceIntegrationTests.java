package pxl.be.review.service;

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
import pxl.be.review.api.data.CreateReviewRequest;
import pxl.be.review.api.data.ReviewResponse;
import pxl.be.review.domain.Review;
import pxl.be.review.repository.ReviewRepository;

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
public class ReviewServiceIntegrationTests {

    @Container
    private static MySQLContainer sqlContainer = new MySQLContainer("mysql:5.7.37");



    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReviewRepository reviewRepository;

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);

    }

    @BeforeEach
    public void setUp() {
        reviewRepository.deleteAll();
    }



    @Test
    @Transactional
    public void testGetReviewIntegration() {
        Review review = Review.builder()
                .content("Test Review")
                .author("Author")
                .postId(1L)
                .isApproved(true)
                .build();
        reviewRepository.save(review);

        ReviewResponse reviewResponse = reviewService.getReview(review.getId());

        assertEquals("Test Review", reviewResponse.getContent());
        assertEquals("Author", reviewResponse.getAuthor());
    }

    @Test
    @Transactional
    public void testDeleteReviewIntegration() {
        Review review = Review.builder()
                .content("Test Review")
                .author("Author")
                .postId(1L)
                .isApproved(true)
                .build();
        reviewRepository.save(review);

        reviewService.deleteReview(review.getId());

        assertEquals(0, reviewRepository.findAll().size());
    }
}