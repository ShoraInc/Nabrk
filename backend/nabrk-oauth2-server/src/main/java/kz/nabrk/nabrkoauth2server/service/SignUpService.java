package kz.nabrk.nabrkoauth2server.service;

import kz.nabrk.nabrkoauth2server.models.User;
import kz.nabrk.nabrkoauth2server.pojo.MessageResponse;
import kz.nabrk.nabrkoauth2server.pojo.request.SignupRequest;
import kz.nabrk.nabrkoauth2server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Set;

@Service
public class SignUpService {
    @Autowired
    UserRolesService userRolesService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;



    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        String  userName = signupRequest.getUsername(),
            email = signupRequest.getEmail(),
            password = signupRequest.getPassword();
        if (userRepository.existsByUserNameOrEmail(userName, email)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: user is exist"));
        }

        User user = new User(userName,
                email,
                passwordEncoder.encode(password));

        Set<String> reqRoles = signupRequest.getGroups();
        userRepository.save(user);
        userRolesService.saveRoles(user, signupRequest.getGroups());
        return ResponseEntity.ok(new MessageResponse("User CREATED"));
    }
}
