package kz.nabrk.nabrkoauth2server.pojo.request;

import lombok.Data;

@Data
public class LoginRequest {
	private String username;
	private String password;
}
