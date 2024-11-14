package pxl.be.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pxl.be.review.domain.Organization;


@Repository
public interface OrganizationRepository extends JpaRepository<Organization,Long> {
//    Optional<Organization> findOrganizationByIdAndDepartments(Long id, List<Department> departments);
//    Optional<Organization> findOrganizationByIdAndDepartmentsAndEmployees(Long id, List<Department> departments, List<Employee> employees);
//    Optional<Organization> findOrganizationByIdAndEmployees(Long id, List<Employee> employees);
}
