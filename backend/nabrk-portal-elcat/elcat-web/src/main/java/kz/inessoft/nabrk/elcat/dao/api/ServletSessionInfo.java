package kz.inessoft.nabrk.elcat.dao.api;

import kz.inessoft.nabrk.dao.api.SessionInfo;
import kz.inessoft.nabrk.elcat.service.auth.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ServletSessionInfo implements SessionInfo {

    @Autowired
    HttpServletRequest request;

    public UserDetailsImpl getUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        System.out.println(authentication.getPrincipal());
        if (authentication.getPrincipal() instanceof String) {
            return null;
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails;
    }

    private List<String> getUserRoles() {
        return getUserDetails() == null
                ? new ArrayList<>()
                : getUserDetails().getRoles().stream().map(String::toString).collect(Collectors.toList());
    }

    private boolean isUserInRoleInternal(String roleName) {
        return getUserDetails().getRoles().stream().map(String::toLowerCase).collect(Collectors.toList())
                .contains(roleName);
    }

    @Override
    public String getRemoteUser() {
        return getUserDetails() == null
                ? null
                : getUserDetails().getUsername();
    }

    @Override
    public boolean isUserInRole(String name) {
        boolean res = getUserRoles().contains(name);
        System.out.printf("access is %s\tfor role = %s, %n", res, name);

        return getUserRoles().contains(name);
    }
}
