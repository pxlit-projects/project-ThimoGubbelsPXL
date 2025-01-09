package pxl.be.comment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pxl.be.comment.domain.Comment;


@Repository
public interface CommentRepository extends JpaRepository<Comment,Long> {

}
