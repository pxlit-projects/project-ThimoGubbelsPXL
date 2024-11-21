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
import pxl.be.post.service.IPostService;

import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
                .build();

        String postString = objectMapper.writeValueAsString(createPostRequest);
        mockMvc.perform(post("/api/post")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postString))
                .andExpect(status().isCreated());

        Mockito.verify(postService).createPost(Mockito.any(CreatePostRequest.class));
    }
}