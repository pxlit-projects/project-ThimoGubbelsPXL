package pxl.be.comment.api.data;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class CommentResponse {
    private String author;
    private String content;
    private Date date;
}
