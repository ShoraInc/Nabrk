package kz.inessoft.nabrk.elcat.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestRest {

    @GetMapping("/rest")
    public Map<String, String> testRest() {
        Map<String, String> map = new HashMap<>();
        map.put("test", "rest");
        return map;
    }
}
