package pxl.be.review.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="review")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;
    @Getter
    @Setter
    private Long postId;

    @Getter
    @Setter
    private String content;

    @Getter
    @Setter
    private String author;
    @Getter
    @Setter
    private boolean isApproved;
}
