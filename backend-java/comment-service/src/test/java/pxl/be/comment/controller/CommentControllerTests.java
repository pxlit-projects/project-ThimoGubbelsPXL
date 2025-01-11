package pxl.be.comment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import pxl.be.comment.api.data.CommentResponse;
import pxl.be.comment.api.data.CreateCommentRequest;
import pxl.be.comment.api.data.UpdateCommentRequest;
import pxl.be.comment.exception.UnAuthorizedException;
import pxl.be.comment.service.ICommentService;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
public class CommentControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ICommentService commentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateComment() throws Exception {
        CreateCommentRequest createCommentRequest = CreateCommentRequest.builder()
                .content("Test Comment")
                .author("Author")
                .postId(1L)
                .build();

        CommentResponse commentResponse = CommentResponse.builder()
                .content("Test Comment")
                .author("Author")
                .date(new Date())
                .build();

        Mockito.when(commentService.createComment(createCommentRequest)).thenReturn(commentResponse);

        String commentString = objectMapper.writeValueAsString(createCommentRequest);
        mockMvc.perform(post("/api/comment")
                        .header("Role", "user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(commentString))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value("Test Comment"))
                .andExpect(jsonPath("$.author").value("Author"));

        verify(commentService).createComment(createCommentRequest);
    }

    @Test
    public void testCreateCommentWithInvalidRole() throws Exception {
        CreateCommentRequest createCommentRequest = CreateCommentRequest.builder()
                .content("Test Comment")
                .author("Author")
                .postId(1L)
                .build();

        String commentString = objectMapper.writeValueAsString(createCommentRequest);
        mockMvc.perform(post("/api/comment")
                        .header("Role", "viewer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(commentString))
                .andExpect(status().isUnauthorized())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UnAuthorizedException))
                .andExpect(result -> assertEquals("Unauthorized access", result.getResolvedException().getMessage()));
    }

    @Test
    public void testGetComment() throws Exception {
        Long commentId = 1L;
        CommentResponse commentResponse = CommentResponse.builder()
                .id(commentId)
                .content("Test Comment")
                .author("Author")
                .date(new Date())
                .build();

        Mockito.when(commentService.getComment(commentId)).thenReturn(commentResponse);

        mockMvc.perform(get("/api/comment/{commentId}", commentId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Test Comment"))
                .andExpect(jsonPath("$.author").value("Author"));

        verify(commentService).getComment(commentId);
    }

    @Test
    public void testUpdateComment() throws Exception {
        Long commentId = 1L;
        UpdateCommentRequest updateCommentRequest = UpdateCommentRequest.builder()
                .content("Updated Comment")
                .author("Author")
                .build();

        CommentResponse commentResponse = CommentResponse.builder()
                .content("Updated Comment")
                .author("Author")
                .date(new Date())
                .build();

        Mockito.when(commentService.updateComment(commentId, updateCommentRequest)).thenReturn(commentResponse);

        String commentString = objectMapper.writeValueAsString(updateCommentRequest);
        mockMvc.perform(patch("/api/comment/{commentId}", commentId)
                        .header("Role", "user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(commentString))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Updated Comment"))
                .andExpect(jsonPath("$.author").value("Author"));

        verify(commentService).updateComment(commentId, updateCommentRequest);
    }

    @Test
    public void testUpdateCommentWithInvalidRole() throws Exception {
        Long commentId = 1L;
        UpdateCommentRequest updateCommentRequest = UpdateCommentRequest.builder()
                .content("Updated Comment")
                .author("Author")
                .build();

        String commentString = objectMapper.writeValueAsString(updateCommentRequest);
        mockMvc.perform(patch("/api/comment/{commentId}", commentId)
                        .header("Role", "viewer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(commentString))
                .andExpect(status().isUnauthorized())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UnAuthorizedException))
                .andExpect(result -> assertEquals("Unauthorized access", result.getResolvedException().getMessage()));
    }

    @Test
    public void testDeleteComment() throws Exception {
        Long commentId = 1L;
        String author = "Author";

        mockMvc.perform(delete("/api/comment/{commentId}/delete", commentId)
                        .header("Role", "user")
                        .header("Author", author)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(commentService).deleteComment(commentId, author);
    }

    @Test
    public void testDeleteCommentWithInvalidRole() throws Exception {
        Long commentId = 1L;
        String author = "Author";

        mockMvc.perform(delete("/api/comment/{commentId}/delete", commentId)
                        .header("Role", "viewer")
                        .header("Author", author)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UnAuthorizedException))
                .andExpect(result -> assertEquals("Unauthorized access", result.getResolvedException().getMessage()));
    }
}