package pxl.be.review.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import pxl.be.review.api.data.OrganizationResponse;
import pxl.be.review.domain.Organization;
import pxl.be.review.exception.ResourceNotFoundException;
import pxl.be.review.repository.OrganizationRepository;

import java.util.List;


@Service
@RequiredArgsConstructor
public class OrganizationService implements IOrganizationService {

    private final OrganizationRepository organizationRepository;



    public Long addOrganization(Organization organization){
        organizationRepository.save(organization);
        return organization.getId();
    }

    public List<OrganizationResponse> getAllOrganizations() {
        List<Organization> organizations= organizationRepository.findAll();
        return organizations.stream().map(organization -> mapToOrganizationResponse(organization)).toList();
    }

    public OrganizationResponse getOrganizationById(Long organizationId){
        Organization organization = organizationRepository.findById(organizationId).orElseThrow(()-> new ResourceNotFoundException("Organization with Id:" + organizationId + "not found"));
           return mapToOrganizationResponse(organization);
    }

//    @Override
//    public OrganizationResponse getOrganizationByIdAndDepartments(Long organizationId, List<Department> departments) {
//       Organization organization = organizationRepository.findOrganizationByIdAndDepartments(organizationId, departments).orElseThrow(()-> new ResourceNotFoundException("Organization with Id and departments:" + organizationId + departments+  "not found"));
//       return mapToOrganizationResponse(organization);
//    }
//
//    @Override
//    public OrganizationResponse getOrganizationByIdAndDepartmentsAndEmployees(Long organizationId, DepartmentAndEmployeeFilter departmentAndEmployeeFilter) {
//        Organization organization = organizationRepository.findOrganizationByIdAndDepartmentsAndEmployees(organizationId, departmentAndEmployeeFilter.getDepartments(), departmentAndEmployeeFilter.getEmployees()).orElseThrow(()-> new ResourceNotFoundException("Organization with Id and departments and employees:" + organizationId +departmentAndEmployeeFilter.getDepartments() + departmentAndEmployeeFilter.getEmployees()+ "not found"));
//        return mapToOrganizationResponse(organization);
//    }
//
//    @Override
//    public OrganizationResponse getOrganizationByIdAndEmployees(Long organizationId, List<Employee> employees) {
//        Organization organization = organizationRepository.findOrganizationByIdAndEmployees(organizationId, employees).orElseThrow(()-> new ResourceNotFoundException("Organization with Id and employees:" + organizationId + employees+  "not found"));
//        return mapToOrganizationResponse(organization);
//    }

    public void deleteOrganization(Long organizationId){
        organizationRepository.deleteById(organizationId);
    }

    public void updateOrganizationAddress(Long id, String newAddress){
        Organization organization = organizationRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Organization with Id:" + id + "not found"));
        organization.setAddress(newAddress);
        organizationRepository.save(organization);

    }

    private OrganizationResponse mapToOrganizationResponse(Organization organization){
        return OrganizationResponse.builder()
                .name(organization.getName())
                .address(organization.getAddress())
                .departments(organization.getDepartments())
                .employees(organization.getEmployees())
                .build();
    }
}
