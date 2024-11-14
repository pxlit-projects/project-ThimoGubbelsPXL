package pxl.be.post.domain;

import jakarta.persistence.*;
import lombok.*;
import pxl.be.post.api.data.EmployeeResponse;


@Entity
@Table(name="employee")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter
    private Long organizationId;
    @Getter
    private Long departmentId;
    @Getter
    private String name;
    @Getter
    private int age;
    @Getter

    private String position;



    public Employee(EmployeeResponse employeeDTO){
        setOrganizationId(employeeDTO.getOrganizationId());
        setDepartmentId(employeeDTO.getDepartmentId());
        setName(employeeDTO.getName());
        setAge(employeeDTO.getAge());
        setPosition(employeeDTO.getPosition());
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setPosition(String position) {
        this.position = position;
    }
}
