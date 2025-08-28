package kz.inessoft.nabrk.elcat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import kz.inessoft.nabrk.dao.service.AppUserService;
import kz.inessoft.nabrk.elcat.repositorywrapper.AppUsersGroupRepositoryWrapper;
import kz.inessoft.nabrk.elcat.repositorywrapper.AppUsersRepositoryWrapper;
import kz.inessoft.nabrk.elcat.service.integration.AuthServerIntegration;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AppUserServiceImpl implements AppUserService {

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    AppUsersRepositoryWrapper appUsersRepositoryWrapper;

    @Autowired
    AuthServerIntegration authServerIntegration;

    @Autowired
    AppUsersGroupRepositoryWrapper appUsersGroupRepositoryWrapper;


    @SneakyThrows
    @Override
    public void addUser(Map<String, String> map, String roleName) {
        String password = map.get("password");
        String email = map.get("ibm-primaryEmail");
        String userName = map.get("cn");
        appUsersRepositoryWrapper.createUser(userName, password, email);
        appUsersGroupRepositoryWrapper.saveUserGroup(userName, roleName);
//
//        send email
        authServerIntegration.activateUser(userName, password, email);

    }
}
