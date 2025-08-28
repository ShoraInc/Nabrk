package kz.nabrk.nabrkoauth2server.pojo.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;
import java.util.Set;

@Data
@Validated
public class RegistrationRequest {
    @NotNull
    private String firstName;// - Surname *
    @NotNull
    private String lastName;// - Firstname *
    private String middleName;// - Second name
    @NotNull
    private String email;// - Email *
    private Short genderId;// - Sex
    @NotNull
    private Short yearOfBirth;// - Year of birth *
    private Short nationalityId;// - Nationality
    private String homeAddress;// - Residence address
    private Short educationId;// - Education
    private Short socialStatusId;// - Social status
    private Short academicDegreeId;// - Degree
    private String job;// - Job
    private String placeOfStudy;// - Place of study


}
