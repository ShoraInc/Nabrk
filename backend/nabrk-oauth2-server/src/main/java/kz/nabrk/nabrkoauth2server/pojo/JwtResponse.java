package kz.nabrk.nabrkoauth2server.pojo;

import lombok.Data;

import java.util.List;

@Data
public class JwtResponse {

    private String type = "Bearer";
    private String token;
    private String username;
    private String email;
    private List<String> roles;

    public JwtResponse(String token, String username, String email, List<String> roles) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }

}
