package pxl.be.post.controller;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pxl.be.post.api.data.EmployeeRequest;
import pxl.be.post.api.data.EmployeeResponse;
import pxl.be.post.service.IEmployeeService;


@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {
    private final IEmployeeService employeeService;

    private static final Logger log = LoggerFactory.getLogger(EmployeeController.class);


    @GetMapping
    public ResponseEntity getEmployees(){
        log.info("Getting employees");
        log.debug("Getting employees");
        return new ResponseEntity(employeeService.getAllEmployees(), HttpStatus.OK);

    }
    @GetMapping("/{employeeId}")
    public EmployeeResponse getEmployee(@PathVariable Long employeeId){
        return employeeService.getEmployeeById(employeeId);
    }

    @GetMapping("/department/{departmentId}")
    public EmployeeResponse getEmployeeByDepartment(@PathVariable Long departmentId){
        return employeeService.getEmployeeByDepartmentId(departmentId);
    }

    @GetMapping("/organization/{organizationId}")
    public EmployeeResponse getEmployeeByOrganization(@PathVariable Long organizationId){
        return employeeService.getEmployeeByOrganizationid(organizationId);
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addEmployee(@RequestBody EmployeeRequest employeeRequest){
         employeeService.addEmployee(employeeRequest);

    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long employeeId){
        employeeService.deleteEmployee(employeeId);
        return ResponseEntity.ok("Employee with id: " + employeeId + " deleted");
    }

    @PutMapping("/{employeeId}/position")
    public ResponseEntity<String> updateEmployeePosition(@PathVariable Long employeeId, @RequestBody String newPosition){
        employeeService.updateEmployeePosition(employeeId,newPosition);
        return ResponseEntity.ok("Employee with id: " + employeeId + " position updated to: "+ newPosition);
    }
}
