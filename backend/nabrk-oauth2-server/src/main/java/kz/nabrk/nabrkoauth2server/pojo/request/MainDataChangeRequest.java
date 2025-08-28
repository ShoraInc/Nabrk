package kz.nabrk.nabrkoauth2server.pojo.request;

import lombok.Data;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

@Data
@Validated
public class MainDataChangeRequest {
    @NotNull
    private String firstName;
    @NotNull
    private String lastname;
    @Email
    @NotNull
    private String email;
}
