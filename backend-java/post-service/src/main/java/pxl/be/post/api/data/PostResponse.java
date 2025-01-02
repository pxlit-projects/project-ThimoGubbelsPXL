package pxl.be.post.api.data;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private boolean isConcept;
    private boolean isApproved;
    private boolean isPublished;
    private Review review;
    private String author;
    private Date date;
}
