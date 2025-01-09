package pxl.be.comment.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "comment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;
    @Getter
    @Setter
    private Long postId;

    @Getter
    @Setter
    private String author;

    @Getter
    private String content;
    @Getter
    @Setter
    private Date date;

    public void setContent(String content) {
        this.content = content;
        setDate(new Date());
    }
}
