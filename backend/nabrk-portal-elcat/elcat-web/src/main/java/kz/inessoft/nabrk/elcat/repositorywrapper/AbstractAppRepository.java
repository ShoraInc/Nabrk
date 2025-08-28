package kz.inessoft.nabrk.elcat.repositorywrapper;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import java.util.LinkedHashMap;

public abstract class AbstractAppRepository {
    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public Long getNextId(String tableName) {
        return namedParameterJdbcTemplate.queryForObject("select max(\"ID\") from \"" + tableName + "\"", new LinkedHashMap<>(), Long.class);
    }

}
