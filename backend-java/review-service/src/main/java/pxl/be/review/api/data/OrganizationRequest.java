package pxl.be.review.api.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pxl.be.review.domain.Department;
import pxl.be.review.domain.Employee;

import java.util.ArrayList;
import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationRequest {
    private String name;

    private List<Employee> employees = new ArrayList<>();

    private List<Department> departments = new ArrayList<>();

    private String address;

}
