package kz.nabrk.nabrkoauth2server.service;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.jsonwebtoken.Claims;
import kz.nabrk.nabrkoauth2server.models.User;
import kz.nabrk.nabrkoauth2server.models.UserGroup;
import kz.nabrk.nabrkoauth2server.models.artifact.AppReader;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;

@Data
public class UserDetailsImpl implements UserDetails {

    private static final long serialVersionUID = 1L;

    //    private Long id;
    private String username;
    private String email;
    @JsonIgnore
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private Collection<String> roles;
    private Map<String, Object> claimsMap;

    public UserDetailsImpl(String username, String email, String password,
                           Collection<? extends GrantedAuthority> authorities, List<String> roleNames,
                           Map<String,String> fio) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        roles = roleNames;
        //
        StringBuilder fullName = new StringBuilder();
        fullName.append(!fio.containsKey("")? "" : fio.get("firstName"));
        fullName.append(!fio.containsKey("")? "" : String.format(" %s", fio.get("middleName")));
        fullName.append(!fio.containsKey("")? "" : String.format(" %s", fio.get("lastName")));

        claimsMap = new LinkedHashMap<>(fio);
        claimsMap.put("fullName", fullName);
        claimsMap.put("username", username);
        claimsMap.put("email", email);
        claimsMap.put("roles", roles);
    }

    public UserDetailsImpl(Claims claims) {
        this.username = claims.get("username").toString();
        this.email = claims.get("email") == null? null : claims.get("email").toString();
        this.roles = (List<String>) claims.get("roles");
        this.authorities = createAuthorities(this.roles);
        claimsMap = claims;
    }

    public static UserDetailsImpl build(User user, List<UserGroup> roles, AppReader reader) {
        List<String> roleNames = createRoleNames(roles);
        List<GrantedAuthority> authorities = createAuthorities(roleNames);
        Map<String,String> fio = new LinkedHashMap<>();
        fio.put("firstName",reader.getFirstName());
        fio.put("middleName",reader.getMiddleName());
        fio.put("lastName",reader.getLastName());
        return new UserDetailsImpl(
                user.getUserName(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                roleNames,
                fio);
    }

    private static List<GrantedAuthority> createAuthorities(Collection<String> roleNames) {
        return roleNames.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }

    private static List<String> createRoleNames(List<UserGroup> roles) {
        return roles.stream().map(UserGroup::getUserGroup).collect(Collectors.toList());
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        UserDetailsImpl other = (UserDetailsImpl) obj;
        if (username == null) {
            if (other.username != null)
                return false;
        } else if (!username.equals(other.username))
            return false;
        return true;
    }

}
