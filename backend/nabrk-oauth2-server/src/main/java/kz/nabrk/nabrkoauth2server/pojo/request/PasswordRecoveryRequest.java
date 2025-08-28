package kz.nabrk.nabrkoauth2server.pojo.request;

import lombok.Data;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;

@Data
public class PasswordRecoveryRequest {
    private String userName;    //  *
    private String email;   // - Email *
}
