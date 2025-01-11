package pxl.be.comment.domain;

import org.junit.jupiter.api.Test;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

public class CommentTests {

    @Test
    public void testGettersAndSetters() {
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setPostId(2L);
        comment.setAuthor("Author");
        comment.setContent("Content");
        Date date = new Date();
        comment.setDate(date);

        assertEquals(1L, comment.getId());
        assertEquals(2L, comment.getPostId());
        assertEquals("Author", comment.getAuthor());
        assertEquals("Content", comment.getContent());
        assertEquals(date, comment.getDate());
    }

    @Test
    public void testSetContentUpdatesDate() throws InterruptedException {
        Comment comment = new Comment();
        Date initialDate = new Date();
        comment.setDate(initialDate);

        TimeUnit.SECONDS.sleep(2);

        comment.setContent("New Content");

        assertEquals("New Content", comment.getContent());
        assertNotEquals(initialDate, comment.getDate());
    }

    @Test
    public void testBuilder() {
        Date date = new Date();
        Comment comment = Comment.builder()
                .id(1L)
                .postId(2L)
                .author("Author")
                .content("Content")
                .date(date)
                .build();

        assertEquals(1L, comment.getId());
        assertEquals(2L, comment.getPostId());
        assertEquals("Author", comment.getAuthor());
        assertEquals("Content", comment.getContent());
        assertEquals(date, comment.getDate());
    }
}