package pxl.be.post.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "post")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter
    @Setter
    @ElementCollection
    @CollectionTable(name = "post_comment_ids", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "comment_id")
    private List<Long> commentIds;

    @Getter
    @Setter

    private Long reviewId;
    @Getter
    @Setter
    private String title;

    @Getter
    @Setter
    private String content;

    @Getter
    @Setter
    private boolean isConcept = true;

    @Getter
    private boolean isApproved = false;
    @Getter
    private boolean isPublished = false;

    @Getter
    private String author;

    @Getter
    @Setter
    private Date date;


    public void setIsApproved(boolean isApproved) {
        setReviewId(null);
        this.isApproved = isApproved;
    }

    public void setContent(String content) {
        setIsApproved(false);
        this.content = content;
    }
    public void setConcept(boolean concept) {
        if(concept){
            setReviewId(null);
        }
        this.isConcept = concept;
    }

    public void setTitle(String title) {
        setIsApproved(false);
        this.title = title;
    }

    public void publish() {
        if(!isApproved){
            throw new IllegalStateException("Post is not approved");
        }else if(isConcept){
            throw new IllegalStateException("Post is a concept");
        }
        this.isPublished = true;


    }

    public void addComment(Long commentId) {
        commentIds.add(commentId);
    }
    public void removeComment(Long commentId) {
        commentIds.remove(commentId);
    }


}
