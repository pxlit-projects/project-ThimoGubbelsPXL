package pxl.be.comment.api.data;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private Long postId;
    private String author;
    private String content;
    private Date date;
}
