package pxl.be.comment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pxl.be.comment.api.data.CommentResponse;
import pxl.be.comment.api.data.CreateCommentRequest;
import pxl.be.comment.api.data.DeleteCommentRequest;
import pxl.be.comment.api.data.UpdateCommentRequest;
import pxl.be.comment.exception.UnAuthorizedException;
import pxl.be.comment.service.ICommentService;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
@Validated
public class CommentController {

    private final ICommentService commentService;

    private static final Logger log = LoggerFactory.getLogger(CommentController.class);

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<CommentResponse> createComment(@RequestHeader(value = "Role", required = true) String headerValue, @Valid @RequestBody CreateCommentRequest createCommentRequest){
        if(!headerValue.equals("user")){
            log.info("User with role " + headerValue + " tried to create a comment");
            throw new UnAuthorizedException("Unauthorized access");

        }
        log.info("Received create comment request");


        return new ResponseEntity<>(commentService.createComment(createCommentRequest), HttpStatus.CREATED);

    }

    @GetMapping(value ="/{reviewId}", produces = MediaType.APPLICATION_JSON_VALUE )
    public ResponseEntity<CommentResponse> getComment(@PathVariable Long commentId){
       log.info("Receiving comment request for comment with id: " + commentId);
        return new ResponseEntity<>(commentService.getComment(commentId), HttpStatus.OK);
    }

    @PutMapping("/{commentId}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<CommentResponse> updateComment(@RequestHeader(value = "Role", required = true) String headerValue, @PathVariable Long commentId, @Valid @RequestBody UpdateCommentRequest updateCommentRequest){
        if(!headerValue.equals("user")){
            log.info("User with role " + headerValue + " tried to create a comment");
            throw new UnAuthorizedException("Unauthorized access");
        }

        log.info("Received update comment request");

        return new ResponseEntity<>(commentService.updateComment(commentId, updateCommentRequest), HttpStatus.OK);

    }

    @PutMapping("/{commentId}/delete")
    @ResponseStatus(HttpStatus.OK)
    public void deleteComment(@RequestHeader(value = "Role", required = true) String headerValue, @PathVariable Long commentId, @Valid @RequestBody DeleteCommentRequest deleteCommentRequest){
        if(!headerValue.equals("user")){
            log.info("User with role " + headerValue + " tried to delete a comment");
            throw new UnAuthorizedException("Unauthorized access");
        }

        log.info("Received delete comment request");
        commentService.deleteComment(commentId, deleteCommentRequest);

    }

}
