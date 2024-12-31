package pxl.be.post.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.PostResponse;
import pxl.be.post.api.data.PublicPostResponse;
import pxl.be.post.domain.Post;
import pxl.be.post.exception.ResourceNotFoundException;
import pxl.be.post.repository.PostRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.when;



public class PostServiceTests {



    @InjectMocks
    private PostService postService;



    @Mock
    private PostRepository mockPostRepository;




    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

    }




    @Test
    public void testCreatePostShouldInvokeRepositorySave() {
        // Assemble
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Test Post")
                .content("This is a test post.")
                .author("Author")
                .date(new Date())
                .build();

        Post post = Post.builder()
                .title(createPostRequest.getTitle())
                .content(createPostRequest.getContent())
                .author(createPostRequest.getAuthor())
                .date(createPostRequest.getDate())
                .build();

        // Act
        postService.createPost(createPostRequest);

        // Assert
        verify(mockPostRepository).save(post);
    }

    @Test
    public void testUpdatePostShouldInvokeRepositorySave() {
        // Assemble
        Long postId = 1L;
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Updated Post")
                .content("This is an updated post.")
                .author("Author")
                .date(new Date())
                .isConcept(true)
                .build();

        Post existingPost = Post.builder()
                .id(postId)
                .title("Old Post")
                .content("This is an old post.")
                .author("Author")
                .date(new Date())
                .build();

        when(mockPostRepository.findById(postId)).thenReturn(Optional.of(existingPost));

        // Act
        postService.updatePost(postId, createPostRequest);

        // Assert
        assertEquals("Updated Post", existingPost.getTitle());
        assertEquals("This is an updated post.", existingPost.getContent());
        assertTrue(existingPost.isConcept());
        verify(mockPostRepository).save(existingPost);
    }

    @Test
    public void testUpdatePostShouldThrowResourceNotFoundException() {
        // Assemble
        Long postId = 1L;
        CreatePostRequest createPostRequest = CreatePostRequest.builder()
                .title("Updated Post")
                .content("This is an updated post.")
                .author("Author")
                .date(new Date())
                .isConcept(true)
                .build();

        when(mockPostRepository.findById(postId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> postService.updatePost(postId, createPostRequest));
    }

    @Test
    public void testGetAllPostsShouldReturnPostResponses() {
        // Assemble
        Post post1 = Post.builder()
                .id(1L)
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .build();

        Post post2 = Post.builder()
                .id(2L)
                .title("Post 2")
                .content("Content 2")
                .author("Author 2")
                .date(new Date())
                .build();

        when(mockPostRepository.findAll()).thenReturn(List.of(post1, post2));

        // Act
        List<PostResponse> postResponses = postService.getAllPosts();

        // Assert
        assertEquals(2, postResponses.size());
        assertEquals("Post 1", postResponses.get(0).getTitle());
        assertEquals("Post 2", postResponses.get(1).getTitle());
    }

    @Test
    public void testFilterPostsShouldReturnFilteredPosts() {
        // Assemble
        Post post1 = Post.builder()
                .id(1L)
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .build();

        Post post2 = Post.builder()
                .id(2L)
                .title("Post 2")
                .content("Content 2")
                .author("Author 2")
                .date(new Date())
                .build();

        when(mockPostRepository.findAll()).thenReturn(List.of(post1, post2));

        // Act
        Pageable pageable = PageRequest.of(0, 10);
        Page<PublicPostResponse> filteredPosts = postService.filterPosts("Content 1", "Author 1", null, null, pageable);

        // Assert
        assertEquals(1, filteredPosts.getTotalElements());
        assertEquals("Post 1", filteredPosts.getContent().get(0).getTitle());
    }

    @Test
    public void testGetAllPublicPostsShouldReturnPublicPosts() {
        // Assemble
        Post post1 = Post.builder()
                .id(1L)
                .title("Post 1")
                .content("Content 1")
                .author("Author 1")
                .date(new Date())
                .isConcept(true)
                .build();

        Post post2 = Post.builder()
                .id(2L)
                .title("Post 2")
                .content("Content 2")
                .author("Author 2")
                .date(new Date())
                .isConcept(false)
                .build();

        when(mockPostRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(List.of(post1, post2)));

        // Act
        Pageable pageable = PageRequest.of(0, 10);
        Page<PublicPostResponse> publicPosts = postService.getAllPublicPosts(pageable);

        // Assert
        assertEquals(1, publicPosts.getTotalElements());
        assertEquals("Post 1", publicPosts.getContent().get(0).getTitle());
    }


}