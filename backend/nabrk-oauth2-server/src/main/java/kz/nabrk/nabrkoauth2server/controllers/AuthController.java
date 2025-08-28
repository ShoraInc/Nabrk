package kz.nabrk.nabrkoauth2server.controllers;

import kz.nabrk.nabrkoauth2server.pojo.request.LoginRequest;
import kz.nabrk.nabrkoauth2server.pojo.request.SignupRequest;
import kz.nabrk.nabrkoauth2server.service.SignInService;
import kz.nabrk.nabrkoauth2server.service.SignUpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    SignUpService signUpService;

    @Autowired
    SignInService signInService;

    @PostMapping("/signIn")
    public ResponseEntity<?> authUser(@RequestBody LoginRequest loginRequest) {
        return signInService.authUser(loginRequest);
    }


    @PostMapping("/signUp")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        return signUpService.registerUser(signupRequest);
    }

    @PostMapping("/me")
    public ResponseEntity<?> getTokenInfo(@RequestBody SignupRequest signupRequest) {
        return signUpService.registerUser(signupRequest);
    }


}
