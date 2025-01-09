package pxl.be.post.api.data;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class CommentMessage implements Serializable {
    private Long postId;
    private Long commentId;
    private boolean isAdded;

}
