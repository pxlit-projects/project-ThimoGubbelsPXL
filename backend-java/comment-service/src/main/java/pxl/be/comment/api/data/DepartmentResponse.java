package pxl.be.comment.api.data;
import lombok.*;
import pxl.be.comment.domain.Employee;


import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {

    private Long organizationId;

    private String name;

    private List<Employee> employees = new ArrayList<>();

    private String position;
}
