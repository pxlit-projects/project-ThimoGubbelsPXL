package pxl.be.comment.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import pxl.be.comment.api.data.*;
import pxl.be.comment.domain.Comment;
import pxl.be.comment.exception.ResourceNotFoundException;
import pxl.be.comment.exception.UnAuthorizedException;
import pxl.be.comment.repository.CommentRepository;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CommentServiceTests {

    @InjectMocks
    private CommentService commentService;

    @Mock
    private CommentRepository mockCommentRepository;

    @Mock
    private RabbitTemplate mockRabbitTemplate;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateCommentShouldInvokeRepositorySave() {
        CreateCommentRequest createCommentRequest = CreateCommentRequest.builder()
                .content("Test Comment")
                .author("Author")
                .postId(1L)
                .build();

        Comment comment = Comment.builder()
                .content(createCommentRequest.getContent())
                .author(createCommentRequest.getAuthor())
                .postId(createCommentRequest.getPostId())
                .date(new Date())
                .build();

        when(mockCommentRepository.save(any(Comment.class))).thenReturn(comment);

        CommentResponse commentResponse = commentService.createComment(createCommentRequest);

        assertEquals("Test Comment", commentResponse.getContent());
        assertEquals("Author", commentResponse.getAuthor());
        verify(mockCommentRepository).save(any(Comment.class));
        verify(mockRabbitTemplate).convertAndSend(eq("comment"), any(CommentMessage.class));
    }

    @Test
    public void testGetCommentShouldReturnCommentResponse() {
        Long commentId = 1L;
        Comment comment = Comment.builder()
                .id(commentId)
                .content("Test Comment")
                .author("Author")
                .postId(1L)
                .date(new Date())
                .build();

        when(mockCommentRepository.findById(commentId)).thenReturn(Optional.of(comment));

        CommentResponse commentResponse = commentService.getComment(commentId);

        assertEquals("Test Comment", commentResponse.getContent());
        assertEquals("Author", commentResponse.getAuthor());
    }

    @Test
    public void testGetCommentShouldThrowResourceNotFoundException() {
        Long commentId = 1L;

        when(mockCommentRepository.findById(commentId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> commentService.getComment(commentId));
    }

    @Test
    public void testUpdateCommentShouldInvokeRepositorySave() {
        Long commentId = 1L;
        UpdateCommentRequest updateCommentRequest = UpdateCommentRequest.builder()
                .content("Updated Comment")
                .build();

        Comment existingComment = Comment.builder()
                .id(commentId)
                .content("Old Comment")
                .author("Author")
                .postId(1L)
                .date(new Date())
                .build();

        when(mockCommentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));

        CommentResponse commentResponse = commentService.updateComment(commentId, updateCommentRequest);

        assertEquals("Updated Comment", commentResponse.getContent());
        verify(mockCommentRepository).save(existingComment);
    }

    @Test
    public void testUpdateCommentShouldThrowResourceNotFoundException() {
        Long commentId = 1L;
        UpdateCommentRequest updateCommentRequest = UpdateCommentRequest.builder()
                .content("Updated Comment")
                .build();

        when(mockCommentRepository.findById(commentId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> commentService.updateComment(commentId, updateCommentRequest));
    }

    @Test
    public void testDeleteCommentShouldInvokeRepositoryDelete() {
        Long commentId = 1L;
        String author = "Author";

        Comment existingComment = Comment.builder()
                .id(commentId)
                .content("Test Comment")
                .author(author)
                .postId(1L)
                .date(new Date())
                .build();

        when(mockCommentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));

        commentService.deleteComment(commentId, author);

        verify(mockCommentRepository).delete(existingComment);
        verify(mockRabbitTemplate).convertAndSend(eq("comment"), any(CommentMessage.class));
    }

    @Test
    public void testDeleteCommentShouldThrowResourceNotFoundException() {
        Long commentId = 1L;
        String author = "Author";

        when(mockCommentRepository.findById(commentId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> commentService.deleteComment(commentId, author));
    }

    @Test
    public void testDeleteCommentShouldThrowUnAuthorizedException() {
        Long commentId = 1L;
        String author = "Author";
        String differentAuthor = "Different Author";

        Comment existingComment = Comment.builder()
                .id(commentId)
                .content("Test Comment")
                .author(differentAuthor)
                .postId(1L)
                .date(new Date())
                .build();

        when(mockCommentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));

        assertThrows(UnAuthorizedException.class, () -> commentService.deleteComment(commentId, author));
    }
}