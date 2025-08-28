package kz.inessoft.nabrk.elcat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class ElCatWebApp extends SpringBootServletInitializer {
    public static void main(String[] args) {
        SpringApplication.run(ElCatWebApp.class);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ElCatWebApp.class);
    }

}
