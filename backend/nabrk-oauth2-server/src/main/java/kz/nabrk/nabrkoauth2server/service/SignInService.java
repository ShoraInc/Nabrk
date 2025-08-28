package kz.nabrk.nabrkoauth2server.service;

import kz.nabrk.nabrkoauth2server.configs.app.ConstantConfig;
import kz.nabrk.nabrkoauth2server.configs.jwt.JwtUtils;
import kz.nabrk.nabrkoauth2server.pojo.JwtResponse;
import kz.nabrk.nabrkoauth2server.pojo.request.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;


import java.util.stream.Collectors;

@Service
public class SignInService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    ConstantConfig constantConfig;

    @Autowired
    JwtUtils jwtUtils;

    public ResponseEntity<?> authUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication;
        try {
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));
        } catch (Exception e) {
            throw new Error(constantConfig.getErrorBadCredentials().get("kaz"));
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

}
