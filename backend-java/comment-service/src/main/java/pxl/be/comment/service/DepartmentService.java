package pxl.be.comment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pxl.be.comment.api.data.DepartmentRequest;
import pxl.be.comment.api.data.DepartmentResponse;
import pxl.be.comment.domain.Department;
import pxl.be.comment.exception.ResourceNotFoundException;
import pxl.be.comment.repository.CommentRepository;

import java.util.List;


@Service
@RequiredArgsConstructor
public class DepartmentService implements IDepartmentService {

    private final CommentRepository commentRepository;


    public void addDepartment(DepartmentRequest departmentRequest) {
        Department department = Department.builder()
                .name(departmentRequest.getName())
                .employees(departmentRequest.getEmployees())
                .position(departmentRequest.getPosition())
                .build();
        commentRepository.save(department);

    }


    public List<DepartmentResponse> getAllDepartments() {
        return commentRepository.findAll().stream().map(department -> mapToDepartmentResponse(department)).toList();
    }

    public DepartmentResponse getDepartmentById(Long departmentId) {
        Department department = commentRepository.findById(departmentId).orElseThrow(() -> new ResourceNotFoundException("Department with Id:" + departmentId + "not found"));
        return mapToDepartmentResponse(department);
    }

//    @Override
//    public DepartmentResponse getDepartmentByOrganizationIdAndEmployees(Long organizationId, List<Employee> employees) {
//        Department department = departmentRepository.findByOrganizationIdAndEmployees(organizationId, employees).orElseThrow(() -> new ResourceNotFoundException("Department with organizationId and employees: " + organizationId + employees +"not found"));
//        return mapToDepartmentResponse(department);
//    }

    @Override
    public DepartmentResponse getDepartmentByOrganizationId(Long organizationId) {
        Department department = commentRepository.findByOrganizationId(organizationId).orElseThrow(() -> new ResourceNotFoundException("Department with organizationId: "  + organizationId + "not found"));
        return mapToDepartmentResponse(department);

    }

    private DepartmentResponse mapToDepartmentResponse(Department department) {
        return DepartmentResponse.builder()
                .name(department.getName())
                .position(department.getPosition())
                .employees(department.getEmployees())
                .build();
    }

    public void deleteDepartment(Long departmentId) {
        commentRepository.deleteById(departmentId);
    }

    public void updateDepartmentPosition(Long id, String newPosition) {
        Department department = commentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Department with Id:" + id + "not found"));
        department.setPosition(newPosition);
        commentRepository.save(department);

    }
}
