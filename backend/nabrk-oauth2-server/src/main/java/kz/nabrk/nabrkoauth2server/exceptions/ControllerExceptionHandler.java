package kz.nabrk.nabrkoauth2server.exceptions;

import kz.nabrk.nabrkoauth2server.ResponseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestControllerAdvice
public class ControllerExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> exception(Exception e, HttpServletRequest request) throws IOException {
        ResponseException responseException = ResponseException.builder()
                .path(request.getRequestURI())
                .message(e.getMessage())
                .statusName(HttpStatus.BAD_REQUEST)
                .status(HttpStatus.BAD_REQUEST.value())
                .build();
        return new ResponseEntity(responseException, HttpStatus.BAD_REQUEST);
    }

}
