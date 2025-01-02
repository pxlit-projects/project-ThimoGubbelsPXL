package pxl.be.post.api.data;

import lombok.Data;

import java.io.Serializable;

@Data
public class ReviewMessage implements Serializable {
    private Long postId;
    private Long reviewId;
    private String postAuthor;
    private boolean isApproved;


}
