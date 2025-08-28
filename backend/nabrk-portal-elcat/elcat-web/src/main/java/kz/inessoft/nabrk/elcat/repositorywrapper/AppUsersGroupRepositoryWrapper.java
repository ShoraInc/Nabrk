package kz.inessoft.nabrk.elcat.repositorywrapper;

import kz.inessoft.nabrk.dao.api.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class AppUsersGroupRepositoryWrapper extends AbstractAppRepository {
    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    SessionService sessionService;


    public Map<String, Object> saveUserGroup(String userName, String roleName) {
        Map<String, Object> params = new LinkedHashMap();
        params.put("id", getNextId("APP_USERS_GROUP") + 10000);
        params.put("USER_ROLE", userName);
        params.put("USER_NAME", roleName);
        namedParameterJdbcTemplate.update(
                "insert into \"APP_USERS_GROUP\" (\"ID\", \"USER_ROLE\", \"USER_NAME\") values (:id, :USER_ROLE, :USER_NAME)",
                params
        );
        return params;
    }
}
