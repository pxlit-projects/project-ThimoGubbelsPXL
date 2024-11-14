package pxl.be.review.domain;

import jakarta.persistence.*;
import lombok.*;


import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name="organization")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;


    @Getter
    private String name;
    @Getter
    @Transient
    private List<Employee> employees = new ArrayList<>();
    @Getter
    @Transient
    private List<Department> departments = new ArrayList<>();
    @Getter
    private String address;







    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
