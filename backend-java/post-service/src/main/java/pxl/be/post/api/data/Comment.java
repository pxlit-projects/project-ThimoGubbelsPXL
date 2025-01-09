package pxl.be.post.api.data;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class Comment {
    private String content;
    private String author;
    private Date date;
}
