package pxl.be.post.service;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import pxl.be.post.api.data.EmployeeRequest;
import pxl.be.post.api.data.NotificationRequest;
import pxl.be.post.client.NotificationClient;
import pxl.be.post.domain.Employee;
import pxl.be.post.exception.ResourceNotFoundException;
import pxl.be.post.repository.EmployeeRepository;
import pxl.be.post.repository.PostRepository;
import pxl.be.post.api.data.EmployeeResponse;

import java.util.List;


@Service
@RequiredArgsConstructor
public class EmployeeService implements IEmployeeService {

    private final EmployeeRepository postRepository;

    private final NotificationClient notificationClient;

    private final RabbitTemplate rabbitTemplate;

    public List<EmployeeResponse> getAllEmployees() {
        List<Employee> employees = postRepository.findAll();

        rabbitTemplate.convertAndSend("myQueue", "Hello, world!");

        return employees.stream().map(employee -> mapToEmployeeResponse(employee)).toList();
    }


    public void addEmployee(EmployeeRequest employeeRequest) {
        Employee employee = Employee.builder()
                .age(employeeRequest.getAge())
                .name(employeeRequest.getName())
                .position(employeeRequest.getPosition()).build();
        postRepository.save(employee);
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .message("Employee created")
                .sender("Tom")
                .build();
        notificationClient.sendNotification(notificationRequest);

    }

    public EmployeeResponse getEmployeeById(Long employeeId) {
        Employee employee = postRepository.findById(employeeId).orElseThrow(() -> new ResourceNotFoundException("Employee with Id:" + employeeId + "not found"));
        return mapToEmployeeResponse(employee);
    }

    public void deleteEmployee(Long employeeId) {
        postRepository.deleteById(employeeId);
    }

    public void updateEmployeePosition(Long id, String newPosition) {
        Employee employee = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee with Id:" + id + "not found"));
        employee.setPosition(newPosition);
        postRepository.save(employee);

    }

    @Override
    public EmployeeResponse getEmployeeByDepartmentId(Long departmentId) {
        Employee employee = postRepository.findEmployeeByDepartmentId(departmentId).orElseThrow(() -> new ResourceNotFoundException("Employee with department:" + departmentId + "not found"));
        return mapToEmployeeResponse(employee);
    }

    @Override
    public EmployeeResponse getEmployeeByOrganizationid(Long organizationid) {
        Employee employee = postRepository.findEmployeeByOrganizationId(organizationid).orElseThrow(() -> new ResourceNotFoundException("Employee with organizationId:" + organizationid + "not found"));
        return mapToEmployeeResponse(employee);
    }


    private EmployeeResponse mapToEmployeeResponse(Employee employee) {
        return EmployeeResponse.builder()
                .age(employee.getAge())
                .name(employee.getName())
                .position(employee.getPosition())
                .build();
    }

}
