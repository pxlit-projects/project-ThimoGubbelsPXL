package pxl.be.comment.service;

import pxl.be.comment.api.data.DepartmentRequest;
import pxl.be.comment.api.data.DepartmentResponse;

import java.util.List;

public interface IDepartmentService {
    List<DepartmentResponse> getAllDepartments();
    DepartmentResponse getDepartmentById(Long departmentId);

//    DepartmentResponse getDepartmentByOrganizationIdAndEmployees(Long organizationId, List<Employee> employees);
    DepartmentResponse getDepartmentByOrganizationId(Long organizationId);
    void addDepartment(DepartmentRequest departmentRequest);

    void deleteDepartment(Long departmentId);

    void updateDepartmentPosition(Long departmentId, String newPosition);
}
