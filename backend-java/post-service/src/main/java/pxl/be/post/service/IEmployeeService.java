package pxl.be.post.service;

import pxl.be.post.api.data.EmployeeRequest;
import pxl.be.post.api.data.EmployeeResponse;

import java.util.List;

public interface IEmployeeService {
    List<EmployeeResponse> getAllEmployees();

    EmployeeResponse getEmployeeById(Long employeeId);

    void addEmployee(EmployeeRequest employeeRequest);

    void deleteEmployee(Long employeeId);

    void updateEmployeePosition(Long employeeId, String newPosition);
    EmployeeResponse getEmployeeByDepartmentId(Long departmentId);
    EmployeeResponse getEmployeeByOrganizationid(Long organizationid);
}
