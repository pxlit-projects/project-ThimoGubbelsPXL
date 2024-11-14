package pxl.be.comment.domain;

import lombok.Getter;


public class Employee {

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

    public Employee() {
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
