package kz.nabrk.nabrkoauth2server.service.authentication;

import kz.nabrk.nabrkoauth2server.configs.app.ConstantConfig;
import kz.nabrk.nabrkoauth2server.enums.WorkspaceRoles;
import kz.nabrk.nabrkoauth2server.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class AuthenticationService {

    @Autowired
    ConstantConfig constantConfig;

    public UserDetailsImpl getIfHasRoles(WorkspaceRoles role) {
        UserDetailsImpl res = getIfAuthenticated();
        if (!getUserRoles(res).contains(role.toString())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, constantConfig.getAccessPermitError().get("kaz"));
        }
        return res;
    }

    public UserDetailsImpl getIfAuthenticated() {
        UserDetailsImpl res = get();
        if (res == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, constantConfig.getAuthenticationNeedError().get("kaz"));
        }
        return res;
    }

    public UserDetailsImpl get() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getPrincipal() instanceof String) {
            return null;
        }
        UsernamePasswordAuthenticationToken upat = (UsernamePasswordAuthenticationToken) authentication;
        return (UserDetailsImpl) upat.getPrincipal();
    }

    private static List<String> getUserRoles(UserDetailsImpl userDetails) {
        return userDetails.getRoles().stream().map(String::toLowerCase).collect(Collectors.toList());
    }

}
