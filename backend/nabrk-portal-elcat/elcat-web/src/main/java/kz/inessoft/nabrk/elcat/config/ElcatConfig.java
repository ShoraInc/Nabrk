package kz.inessoft.nabrk.elcat.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@EnableWebMvc
@Configuration
@ComponentScan(basePackages = {
    "kz.inessoft.nabrk.elcat",
    "kz.inessoft.nabrk.dao.repository",
    "kz.inessoft.nabrk.solr.service"
})
public class ElcatConfig {
}
