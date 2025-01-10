package pxl.be.comment.service;

import pxl.be.comment.api.data.*;

public interface ICommentService {

    CommentResponse createComment(CreateCommentRequest createCommentRequest);
    CommentResponse getComment(Long id);
    CommentResponse updateComment(Long commentId, UpdateCommentRequest updateCommentRequest);
    void deleteComment(Long commentId, String author);
}
