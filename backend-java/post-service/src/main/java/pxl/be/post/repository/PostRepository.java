package pxl.be.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pxl.be.post.domain.Post;


@Repository
public interface PostRepository extends JpaRepository<Post,Long> {

}
