package pxl.be.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pxl.be.post.domain.Employee;
import pxl.be.post.domain.Post;

import java.util.Optional;


@Repository
public interface PostRepository extends JpaRepository<Post,Long> {
    Optional<Employee> findEmployeeByDepartmentId(Long id);
    Optional<Employee> findEmployeeByOrganizationId(Long id);
}
