package kz.inessoft.nabrk.elcat.service.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.jsonwebtoken.Claims;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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
    private String jwt;

    public UserDetailsImpl(String username, String email, String password,
                           Collection<? extends GrantedAuthority> authorities, List<String> roleNames) {
//        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        roles = roleNames;
        //
        claimsMap = new LinkedHashMap<>();
//        claimsMap.put("id", id == null ? "" : id.toString());
        claimsMap.put("username", username);
        claimsMap.put("email", email);
        claimsMap.put("roles", roles);
    }

    public UserDetailsImpl(Claims claims) {
        this.username = claims.get("username").toString();
        this.username = claims.get("username").toString();
        this.email = claims.get("email") == null? null : claims.get("email").toString();
        this.roles = (List<String>) claims.get("roles");
        this.authorities = createAuthorities(this.roles);
        claimsMap = claims;
    }

    public UserDetailsImpl(Claims claims, String jwt) {
        this(claims);
        this.jwt = jwt;
    }


    private static List<GrantedAuthority> createAuthorities(Collection<String> roleNames) {
        return roleNames.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }

//    private static List<String> createRoleNames(List<UserGroup> roles) {
//        return roles.stream().map(UserGroup::getUserGroup).collect(Collectors.toList());
//    }

    /*
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return authorities;
        }

        @Override
        public String getPassword() {
            return password;
        }

        @Override
        public String getUsername() {
            return username;
        }

        public Long getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

    */
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
