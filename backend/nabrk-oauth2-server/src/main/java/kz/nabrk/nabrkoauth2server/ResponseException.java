package kz.nabrk.nabrkoauth2server;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Builder
@Data
public class ResponseException {
    final String message;
    final HttpStatus statusName;
    final int status;
    final String path;
}
