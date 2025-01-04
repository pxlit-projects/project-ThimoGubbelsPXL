package pxl.be.review.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import pxl.be.review.api.data.CreateReviewRequest;
import pxl.be.review.api.data.ReviewResponse;
import pxl.be.review.exception.UnAuthorizedException;
import pxl.be.review.service.IReviewService;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReviewController.class)
public class ReviewControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IReviewService reviewService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateReview() throws Exception {
        CreateReviewRequest createReviewRequest = CreateReviewRequest.builder()
                .content("Test Review")
                .author("Author")
                .postId(1L)
                .approved(true)
                .postAuthor("Post Author")
                .build();

        String reviewString = objectMapper.writeValueAsString(createReviewRequest);
        mockMvc.perform(post("/api/review")
                        .header("Role", "editor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(reviewString))
                .andExpect(status().isCreated());

        verify(reviewService).createReview(createReviewRequest);
    }

    @Test
    public void testCreateReviewWithInvalidRole() throws Exception {
        CreateReviewRequest createReviewRequest = CreateReviewRequest.builder()
                .content("Test Review")
                .author("Author")
                .postId(1L)
                .approved(true)
                .postAuthor("Post Author")
                .build();

        String reviewString = objectMapper.writeValueAsString(createReviewRequest);
        mockMvc.perform(post("/api/review")
                        .header("Role", "viewer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(reviewString))
                .andExpect(status().isUnauthorized())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UnAuthorizedException))
                .andExpect(result -> assertEquals("Unauthorized access", result.getResolvedException().getMessage()));
    }

    @Test
    public void testGetReview() throws Exception {
        Long reviewId = 1L;
        ReviewResponse reviewResponse = ReviewResponse.builder()
                .content("Test Review")
                .author("Author")
                .build();

        Mockito.when(reviewService.getReview(reviewId)).thenReturn(reviewResponse);

        mockMvc.perform(get("/api/review/{reviewId}", reviewId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Test Review"))
                .andExpect(jsonPath("$.author").value("Author"));

        verify(reviewService).getReview(reviewId);
    }
}