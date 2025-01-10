package pxl.be.review.service;

import pxl.be.review.api.data.CreateReviewRequest;
import pxl.be.review.api.data.ReviewResponse;

import java.util.List;

public interface IReviewService {
    ReviewResponse getReview(Long id);
    void createReview(CreateReviewRequest reviewRequest);
    void deleteReview(Long id);
}
