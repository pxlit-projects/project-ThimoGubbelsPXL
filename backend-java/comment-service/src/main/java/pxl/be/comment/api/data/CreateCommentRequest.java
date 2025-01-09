package pxl.be.comment.api.data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class CreateCommentRequest {
    @NotNull(message = "PostId is mandatory")
    private long postId;

    @NotBlank(message = "Content is mandatory")
    @NotEmpty(message = "Content is mandatory")
    private String content;

    @NotNull(message = "Author is mandatory")
    private String author;
}
