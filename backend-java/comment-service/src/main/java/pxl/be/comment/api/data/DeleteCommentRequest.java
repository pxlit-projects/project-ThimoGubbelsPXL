package pxl.be.comment.api.data;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder

public class DeleteCommentRequest {
    @NotEmpty(message = "Author is mandatory")
    private String author;
}
