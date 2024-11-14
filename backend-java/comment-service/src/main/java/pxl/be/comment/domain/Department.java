package pxl.be.comment.domain;

import jakarta.persistence.*;
import lombok.*;


import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name="department")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
