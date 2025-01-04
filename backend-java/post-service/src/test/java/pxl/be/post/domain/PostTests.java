package pxl.be.post.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class PostTests {

    private Post post;

    @BeforeEach
    public void setUp() {
        post = Post.builder()
                .title("Test Post")
                .content("This is a test post.")
                .author("Author")
                .date(new Date())
                .isConcept(false)
                .isApproved(true)
                .build();
    }

    @Test
    public void testSetIsApproved() {
        post.setIsApproved(true);
        assertTrue(post.isApproved());
        assertNull(post.getReviewId());
    }

    @Test
    public void testSetContent() {
        post.setContent("Updated content");
        assertEquals("Updated content", post.getContent());
        assertFalse(post.isApproved());
    }

    @Test
    public void testSetConcept() {
        post.setConcept(true);
        assertTrue(post.isConcept());
        assertNull(post.getReviewId());
    }

    @Test
    public void testSetTitle() {
        post.setTitle("Updated title");
        assertEquals("Updated title", post.getTitle());
        assertFalse(post.isApproved());
    }

    @Test
    public void testPublish() {
        post.setIsApproved(true);
        post.setConcept(false);
        post.publish();
        assertTrue(post.isPublished());
    }

    @Test
    public void testPublishShouldThrowIllegalStateExceptionIfNotApproved() {
        post.setIsApproved(false);
        IllegalStateException exception = assertThrows(IllegalStateException.class, post::publish);
        assertEquals("Post is not approved", exception.getMessage());
    }

    @Test
    public void testPublishShouldThrowIllegalStateExceptionIfConcept() {
        post.setIsApproved(true);
        post.setConcept(true);
        IllegalStateException exception = assertThrows(IllegalStateException.class, post::publish);
        assertEquals("Post is a concept", exception.getMessage());
    }
}