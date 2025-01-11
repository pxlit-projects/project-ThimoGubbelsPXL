package pxl.be.review.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import pxl.be.review.api.data.CreateReviewRequest;
import pxl.be.review.api.data.ReviewMessage;
import pxl.be.review.api.data.ReviewResponse;
import pxl.be.review.domain.Review;
import pxl.be.review.exception.ResourceNotFoundException;
import pxl.be.review.repository.ReviewRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ReviewServiceTests {

    @InjectMocks
    private ReviewService reviewService;

    @Mock
    private ReviewRepository mockReviewRepository;

    @Mock
    private RabbitTemplate mockRabbitTemplate;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateReviewShouldInvokeRepositorySave() {
        CreateReviewRequest createReviewRequest = CreateReviewRequest.builder()
                .content("Test Review")
                .author("Author")
                .postId(1L)
                .approved(true)
                .postAuthor("Post Author")
                .build();

        Review review = Review.builder()
                .content(createReviewRequest.getContent())
                .author(createReviewRequest.getAuthor())
                .postId(createReviewRequest.getPostId())
                .isApproved(createReviewRequest.isApproved())
                .build();

        when(mockReviewRepository.save(any(Review.class))).thenReturn(review);

        reviewService.createReview(createReviewRequest);

        verify(mockReviewRepository).save(any(Review.class));
        verify(mockRabbitTemplate).convertAndSend(eq("reviewAdded"), any(ReviewMessage.class));
    }

    @Test
    public void testGetReviewShouldReturnReviewResponse() {
        Long reviewId = 1L;
        Review review = Review.builder()
                .id(reviewId)
                .content("Test Review")
                .author("Author")
                .postId(1L)
                .isApproved(true)
                .build();

        when(mockReviewRepository.findAll()).thenReturn(List.of(review));

        ReviewResponse reviewResponse = reviewService.getReview(reviewId);

        assertEquals("Test Review", reviewResponse.getContent());
        assertEquals("Author", reviewResponse.getAuthor());
    }

    @Test
    public void testGetReviewShouldThrowResourceNotFoundException() {
        Long reviewId = 1L;

        when(mockReviewRepository.findAll()).thenReturn(List.of());

        assertThrows(ResourceNotFoundException.class, () -> reviewService.getReview(reviewId));
    }

    @Test
    public void testDeleteReviewShouldInvokeRepositoryDelete() {
        Long reviewId = 1L;

        reviewService.deleteReview(reviewId);

        verify(mockReviewRepository).deleteById(reviewId);
    }

    @Test
    public void testDeleteReviewShouldThrowResourceNotFoundException() {
        Long reviewId = 1L;

        doThrow(new ResourceNotFoundException("Review with Id:" + reviewId + " not found"))
                .when(mockReviewRepository).deleteById(reviewId);

        assertThrows(ResourceNotFoundException.class, () -> reviewService.deleteReview(reviewId));
    }


}