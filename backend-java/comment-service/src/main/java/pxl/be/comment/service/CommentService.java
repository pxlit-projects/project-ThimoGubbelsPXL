package pxl.be.comment.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import pxl.be.comment.api.data.*;
import pxl.be.comment.domain.Comment;
import pxl.be.comment.exception.ResourceNotFoundException;
import pxl.be.comment.exception.UnAuthorizedException;
import pxl.be.comment.repository.CommentRepository;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {
    private final CommentRepository commentRepository;
    private final RabbitTemplate rabbitTemplate;

    private static final Logger log = LoggerFactory.getLogger(CommentService.class);

    public CommentResponse createComment(CreateCommentRequest createCommentRequest) {
        Comment comment = Comment.builder()
                .content(createCommentRequest.getContent())
                .author(createCommentRequest.getAuthor())
                .postId(createCommentRequest.getPostId())
                .build();
        log.info("Saving comment with content: " + comment.getContent());
        commentRepository.save(comment);
        log.info("Sending commentAdded message to RabbitMQ for postId: " + createCommentRequest.getPostId());
        rabbitTemplate.convertAndSend("comment", CommentMessage.builder().postId(createCommentRequest.getPostId()).commentId(comment.getId()).isAdded(true).build());
        return CommentResponse.builder()
                .content(comment.getContent())
                .author(comment.getAuthor())
                .date(comment.getDate()).build();
    }

    public CommentResponse getComment(Long id) {
        log.info("Getting comment with id: " + id);
        Comment comment = commentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Comment with Id:" + id + "not found"));
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .content(comment.getContent())
                .author(comment.getAuthor())
                .date(comment.getDate()).build();
    }

    public CommentResponse updateComment(Long commentId, UpdateCommentRequest updateCommentRequest) {
        log.info("Updating comment with id: " + commentId);
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new ResourceNotFoundException("Comment with Id:" + commentId + "not found"));
        comment.setContent(updateCommentRequest.getContent());
        commentRepository.save(comment);
        return CommentResponse.builder()
                .content(comment.getContent())
                .author(comment.getAuthor())
                .date(comment.getDate()).build();
    }

    public void deleteComment(Long commentId, String author) {

        log.info("Deleting comment with id: " + commentId);
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new ResourceNotFoundException("Comment with Id:" + commentId + "not found"));
        if (!comment.getAuthor().equals(author)) {
            throw new UnAuthorizedException("Author of the comment: " + comment.getAuthor()+  " is not the same as the author of the delete request: " + author);
        }

        commentRepository.delete(comment);
        log.info("Sending commentDeleted message to RabbitMQ for postId: " + comment.getPostId());
        rabbitTemplate.convertAndSend("comment", CommentMessage.builder().postId(comment.getPostId()).commentId(comment.getId()).isAdded(false).build());
    }


}
