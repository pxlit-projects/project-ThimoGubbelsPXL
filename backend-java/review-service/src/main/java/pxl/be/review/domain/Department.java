package pxl.be.review.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;



public class Department {

    @Getter
    private Long id;

    @Getter
    private Long organizationId;
    @Getter
    private String name;
    @Getter
    @Transient
    private List<Employee> employees = new ArrayList<>();
    @Getter
    private String position;

    public Department() {
    }


    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }



    public void setName(String name) {
        this.name = name;
    }


    public void setPosition(String position) {
        this.position = position;
    }
}
