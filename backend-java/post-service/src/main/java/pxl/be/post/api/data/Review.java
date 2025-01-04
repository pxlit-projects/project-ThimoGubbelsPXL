package pxl.be.post.api.data;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Review {
    String content;
    String author;
}
