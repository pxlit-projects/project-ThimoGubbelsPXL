package pxl.be.review.service;

import pxl.be.review.api.data.OrganizationResponse;
import pxl.be.review.domain.Organization;

import java.util.List;

public interface IOrganizationService {

    List<OrganizationResponse> getAllOrganizations();
    OrganizationResponse getOrganizationById(Long organizationId);
//    OrganizationResponse getOrganizationByIdAndDepartments(Long organizationId, List<Department> departments);
//    OrganizationResponse getOrganizationByIdAndDepartmentsAndEmployees(Long organizationId, DepartmentAndEmployeeFilter departmentAndEmployeeFilter);
//    OrganizationResponse getOrganizationByIdAndEmployees(Long organizationId, List<Employee> employees);

    Long addOrganization(Organization organization);

    void deleteOrganization(Long organizationId);

    void updateOrganizationAddress(Long organizationId, String newAddress);
}
