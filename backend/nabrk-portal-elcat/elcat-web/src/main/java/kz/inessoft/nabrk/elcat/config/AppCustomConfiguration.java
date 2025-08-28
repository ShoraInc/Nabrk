package kz.inessoft.nabrk.elcat.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Component
public class AppCustomConfiguration {
    @Primary
    @Bean
    public DataSource dataSource(
            @Value("${db.datasource.url}") String url,
            @Value("${db.datasource.driver-class-name}") String  driverClassName,
            @Value("${db.datasource.username}") String  username,
            @Value("${db.datasource.password}") String  password,
            @Value("${db.datasource.default_schema}") String  default_schema
    ) {
        DriverManagerDataSource ds = new DriverManagerDataSource();
        ds.setUrl(url);
        ds.setDriverClassName(driverClassName);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setSchema(default_schema);
        return ds;
    }

//    public NamedParameterJdbcTemplate namedParameterJdbcTemplate()
}
