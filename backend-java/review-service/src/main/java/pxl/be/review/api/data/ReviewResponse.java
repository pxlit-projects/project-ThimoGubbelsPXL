package pxl.be.review.api.data;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewResponse {
    private String content;
    private String author;
}
