package pxl.be.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pxl.be.post.domain.Employee;
import pxl.be.post.domain.Post;

import java.util.List;
import java.util.Optional;
@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    Optional<Employee> findEmployeeByDepartmentId(Long id);
    Optional<Employee> findEmployeeByOrganizationId(Long id);


}
