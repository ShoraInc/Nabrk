package kz.nabrk.nabrkoauth2server.responses;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;

import java.util.*;

public class AppResponseEntity {
    public static ResponseEntity success(String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", 200);
        body.put("message", message);
        return ResponseEntity.ok(body);
    }
}
