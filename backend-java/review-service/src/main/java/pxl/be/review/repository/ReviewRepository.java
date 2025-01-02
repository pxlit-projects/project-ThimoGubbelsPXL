package pxl.be.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pxl.be.review.domain.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long> {

}
