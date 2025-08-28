package kz.inessoft.nabrk.elcat.repositorywrapper;

import kz.inessoft.nabrk.dao.api.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class AppUsersRepositoryWrapper extends AbstractAppRepository {
    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    SessionService sessionService;


    public long createUser(String userName, String password, String email) {
        Map<String, Object> params = new LinkedHashMap();
        params.put("PASSWORD", passwordEncoder.encode(password));
        params.put("EMAIL", email);
        params.put("USER_NAME", userName);
        Long id = getNextId("APP_USERS") + 10000;
        params.put("ID", id);
        namedParameterJdbcTemplate.update(
                "insert into \"APP_USERS\" (\"ID\", \"EMAIL\", \"PASSWORD\", \"USER_NAME\") values (:ID, :EMAIL,:PASSWORD, :USER_NAME)",
                params
        );

        return id;
    }


    public boolean userExist(String userName) {
        Map<String, String> p = new LinkedHashMap<>();
        p.put("userName", userName);
        return namedParameterJdbcTemplate.queryForObject(
                "select count(\"ID\")>0 from \"APP_USERS\" where \"USER_NAME\" = :userName",
                p,
                boolean.class);
    }

}
