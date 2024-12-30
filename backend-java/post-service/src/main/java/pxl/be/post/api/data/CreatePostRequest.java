package pxl.be.post.api.data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
public class CreatePostRequest {

    @NotBlank(message = "Title is mandatory")
    @NotEmpty(message = "Content is mandatory")
    private String title;

    @NotBlank(message = "Content is mandatory")
    @NotEmpty(message = "Content is mandatory")
    private String content;

    @NotNull(message = "Author is mandatory")
    private String author;

    @NotNull(message = "Date is mandatory")
    private Date date;

    @NotNull(message = "isConcept is mandatory")
    private Boolean isConcept;
}
