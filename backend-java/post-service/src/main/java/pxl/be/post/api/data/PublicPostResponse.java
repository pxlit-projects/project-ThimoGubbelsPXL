package pxl.be.post.api.data;

import lombok.Builder;
import lombok.Data;

import java.util.Date;
@Data
@Builder
public class PublicPostResponse {
    private Long id;
    private String title;
    private String content;
    private String author;
    private Date date;
}
