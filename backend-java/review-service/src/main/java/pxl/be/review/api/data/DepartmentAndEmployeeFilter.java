package pxl.be.review.api.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pxl.be.review.domain.Department;
import pxl.be.review.domain.Employee;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentAndEmployeeFilter {

    List<Department> departments;
    List<Employee> employees;
}
