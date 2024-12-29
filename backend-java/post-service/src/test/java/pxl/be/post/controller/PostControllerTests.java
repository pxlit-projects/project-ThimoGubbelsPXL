package pxl.be.post.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.PostResponse;
import pxl.be.post.exception.UnAuthorizedException;
import pxl.be.post.service.IPostService;

import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
public class PostControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IPostService postService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreatePost() throws Exception {
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Test Post")
                .content("This is a test post.")
                .author("Author")
                .date(new Date())
                .isConcept(false) // Ensure isConcept is provided
                .build();

        String postString = objectMapper.writeValueAsString(createPostRequest);
        mockMvc.perform(post("/api/post")
                        .header("Role", "editor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postString))
                .andExpect(status().isCreated());

        Mockito.verify(postService).createPost(createPostRequest);
    }

    @Test
    public void testCreatePostWithInvalidRole() throws Exception {
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Test Post")
                .content("This is a test post.")
                .author("Author")
                .date(new Date())
                .isConcept(false) // Ensure isConcept is provided
                .build();

        String postString = objectMapper.writeValueAsString(createPostRequest);
        mockMvc.perform(post("/api/post")
                        .header("Role", "viewer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postString))
                .andExpect(status().isUnauthorized())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UnAuthorizedException))
                .andExpect(result -> assertEquals("Unauthorized access", result.getResolvedException().getMessage()));
    }

    @Test
    public void testUpdatePost() throws Exception {
        Long postId = 1L;
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Updated Post")
                .content("This is an updated post.")
                .author("Author")
                .date(new Date())
                .isConcept(true)
                .build();

        String postString = objectMapper.writeValueAsString(createPostRequest);
        mockMvc.perform(put("/api/post/{postId}", postId)
                        .header("Role", "editor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postString))
                .andExpect(status().isOk());

        Mockito.verify(postService).updatePost(postId, createPostRequest);
    }

    @Test
    public void testUpdatePostWithInvalidRole() throws Exception {
        Long postId = 1L;
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Updated Post")
                .content("This is an updated post.")
                .author("Author")
                .date(new Date())
                .isConcept(true)
                .build();

        String postString = objectMapper.writeValueAsString(createPostRequest);
        mockMvc.perform(put("/api/post/{postId}", postId)
                        .header("Role", "viewer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postString))
                .andExpect(status().isUnauthorized())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UnAuthorizedException))
                .andExpect(result -> assertEquals("Unauthorized access", result.getResolvedException().getMessage()));
    }

    @Test
    public void testGetAllPosts() throws Exception {
        PostResponse postResponse1 = PostResponse.builder()
                .id(1L)
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .isConcept(true)
                .build();

        PostResponse postResponse2 = PostResponse.builder()
                .id(2L)
                .title("Post 2")
                .content("Content 2")
                .author("Author 2")
                .date(new Date())
                .isConcept(false)
                .build();

        List<PostResponse> postResponses = List.of(postResponse1, postResponse2);
        Mockito.when(postService.getAllPosts()).thenReturn(postResponses);

        mockMvc.perform(get("/api/post")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Post 1"))
                .andExpect(jsonPath("$[1].title").value("Post 2"));

        Mockito.verify(postService).getAllPosts();
    }
}