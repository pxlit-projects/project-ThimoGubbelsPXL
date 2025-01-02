package pxl.be.review.api.data;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateReviewRequest {
    private Long postId;
    private boolean approved;
    private String content;
    private String author;
    private String postAuthor;
}
