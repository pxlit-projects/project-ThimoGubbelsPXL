package pxl.be.review.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import pxl.be.review.api.data.CreateReviewRequest;
import pxl.be.review.api.data.ReviewMessage;
import pxl.be.review.api.data.ReviewResponse;
import pxl.be.review.controller.ReviewController;
import pxl.be.review.domain.Review;
import pxl.be.review.exception.ResourceNotFoundException;
import pxl.be.review.repository.ReviewRepository;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService{
    private final ReviewRepository reviewRepository;
    private final RabbitTemplate rabbitTemplate;

    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);

    public void createReview(CreateReviewRequest reviewRequest){
        log.debug("Saving review with author: " + reviewRequest.getAuthor());
        log.info("Saving review : " + reviewRequest.toString());
        Review review = Review.builder()
                .content(reviewRequest.getContent())
                .author(reviewRequest.getAuthor())
                .postId(reviewRequest.getPostId())
                .isApproved(reviewRequest.isApproved())
                .build();
       Review addedReview = reviewRepository.save(review);
       log.info(reviewRepository.findAll().toString());
       rabbitTemplate.convertAndSend("reviewAdded",  ReviewMessage.builder().postId(addedReview.getPostId()).reviewId(addedReview.getId()).postAuthor(reviewRequest.getPostAuthor()).isApproved(reviewRequest.isApproved()).build());


    }
    public ReviewResponse getReview(Long id){
        log.info("Getting review with id: " + id + id.getClass().getName());
        log.info(reviewRepository.findAll().toString());
        Review review= reviewRepository.findAll().stream().filter(r->r.getId().equals(id)).findFirst().orElseThrow(() -> new ResourceNotFoundException("Review with Id:" + id + "not found"));
        log.info(review.toString());
        return ReviewResponse.builder()
                .content(review.getContent())
                .author(review.getAuthor()).build();
    }

    public void deleteReview(Long id){
        log.info("Deleting review with id: " + id);
        reviewRepository.deleteById(id);
    }
}
