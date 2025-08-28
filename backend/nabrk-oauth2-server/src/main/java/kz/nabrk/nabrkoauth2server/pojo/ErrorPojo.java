package kz.nabrk.nabrkoauth2server.pojo;

import lombok.Data;

@Data
public class ErrorPojo {
    private Integer status;
    private String message;

    public ErrorPojo(Integer status, String message) {
        this.status = status;
        this.message = message;
    }
}
