package pxl.be.review.api.data;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
@Data
@Builder
public class ReviewMessage implements Serializable {
    private Long postId;
    private Long reviewId;
    private String postAuthor;
    private boolean isApproved;
}
