package pxl.be.review.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pxl.be.review.api.data.OrganizationResponse;
import pxl.be.review.domain.Organization;
import pxl.be.review.service.IOrganizationService;


@RestController
@RequestMapping("/api/organization")
@RequiredArgsConstructor
public class OrganizationController {
    private final IOrganizationService organizationService;

    @GetMapping
    public ResponseEntity getOrganizations(){
        return new ResponseEntity(organizationService.getAllOrganizations(), HttpStatus.OK );
    }

    @GetMapping("/{organizationId}")
    public OrganizationResponse getOrganization(@PathVariable Long organizationId){
        return organizationService.getOrganizationById(organizationId);
    }

//    @GetMapping("(/{organizationId}/with-departments")
//    public OrganizationResponse getOrganizationByIdAndDepartments(@PathVariable Long organizationId, @RequestBody List<Department> departments){
//        return organizationService.getOrganizationByIdAndDepartments(organizationId, departments);
//    }
//    @GetMapping("(/{organizationId}/with-departments-and-employees")
//    public OrganizationResponse getOrganizationByIdAndDepartmentsAndEmployees(@PathVariable Long organizationId, @RequestBody DepartmentAndEmployeeFilter departmentAndEmployeeFilter){
//        return organizationService.getOrganizationByIdAndDepartmentsAndEmployees(organizationId, departmentAndEmployeeFilter);
//    }
//    @GetMapping("(/{organizationId}/with-departments")
//    public OrganizationResponse getOrganizationByIdAndEmployees(@PathVariable Long organizationId, @RequestBody List<Employee> employees){
//        return organizationService.getOrganizationByIdAndEmployees(organizationId, employees);
//    }


    @PostMapping
    public ResponseEntity<Long> addOrganization(@RequestBody @Validated Organization organization){
        Long id = organizationService.addOrganization(organization);
        return new ResponseEntity<Long>(id, HttpStatus.CREATED);
    }

    @DeleteMapping("/{organizationId}")
    public ResponseEntity<String> deleteOrganiztion(@PathVariable Long organizationId){
        organizationService.deleteOrganization(organizationId);
        return ResponseEntity.ok("Organization with id: " + organizationId + " deleted");
    }

    @PutMapping("/{organizationId}/address")
    public ResponseEntity<String> updateOrganizationAddress(@PathVariable Long organizationId, @RequestBody String newAddress){
        organizationService.updateOrganizationAddress(organizationId,newAddress);
        return ResponseEntity.ok("Organization with id: " + organizationId + " address updated to: "+ newAddress);
    }
}
