package pxl.be.review.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pxl.be.review.api.data.CreateReviewRequest;
import pxl.be.review.api.data.ReviewResponse;
import pxl.be.review.exception.UnAuthorizedException;
import pxl.be.review.service.IReviewService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;

import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
@Validated
public class ReviewController {
    private final IReviewService reviewService;

    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);

    @GetMapping(value ="/{reviewId}", produces = MediaType.APPLICATION_JSON_VALUE )
    public ResponseEntity<ReviewResponse> getReview(@PathVariable Long reviewId){
        log.info("Getting review with id: " + reviewId + reviewId.getClass().getName());
        return new ResponseEntity<>(reviewService.getReview(reviewId), HttpStatus.OK);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createReview(@RequestHeader(value = "Role", required = true) String headerValue, @Valid @RequestBody CreateReviewRequest createReviewRequest){
        if(!headerValue.equals("editor")){
            throw new UnAuthorizedException("Unauthorized access");
        }
        log.info("Creating review");
        log.info(createReviewRequest.toString());
        log.debug("Creating post");
        reviewService.createReview(createReviewRequest);

    }



}
