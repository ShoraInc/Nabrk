package kz.nabrk.nabrkoauth2server.controllers;

//import kz.inessoft.nabrk.dao.dto.RegistrationRequest;
//import kz.inessoft.nabrk.dao.repository.ReaderRepository;

import kz.nabrk.nabrkoauth2server.configs.app.ConstantConfig;
import kz.nabrk.nabrkoauth2server.configs.jwt.JwtUtils;
import kz.nabrk.nabrkoauth2server.pojo.ErrorPojo;
import kz.nabrk.nabrkoauth2server.pojo.request.*;
import kz.nabrk.nabrkoauth2server.responses.AppResponseEntity;
import kz.nabrk.nabrkoauth2server.service.SignInService;
import kz.nabrk.nabrkoauth2server.service.SignUpService;
import kz.nabrk.nabrkoauth2server.service.UserDetailsImpl;
import kz.nabrk.nabrkoauth2server.service.artifact.RegistrationService;
import kz.nabrk.nabrkoauth2server.service.authentication.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    @Autowired
    SignUpService signUpService;

    @Autowired
    SignInService signInService;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    RegistrationService registrationService;

    @Autowired
    ConstantConfig constantConfig;

    @Autowired
    AuthenticationService authenticationService;


    @GetMapping("/me")
    public ResponseEntity<?> me() {
        UserDetailsImpl udi = authenticationService.getIfAuthenticated();
        return ResponseEntity.ok(udi.getClaimsMap());
    }

    @PostMapping("/signIn")
    public ResponseEntity<?> authUser(@RequestBody LoginRequest loginRequest) {
        return signInService.authUser(loginRequest);
    }

    /**
     * test method
     */
    @PostMapping("/signUp")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        return signUpService.registerUser(signupRequest);
    }

    @PostMapping("/registration")
    public ResponseEntity<?> registration(@Valid @RequestBody RegistrationRequest registrationRequest) {
        registrationService.registration(registrationRequest);
        return AppResponseEntity.success(constantConfig.getRegistrationSuccess().get("kaz"));
    }

    @PostMapping("/passwordRecovery")
    public ResponseEntity<?> passwordRecovery(@RequestBody PasswordRecoveryRequest passwordRecoveryRequest) {
        registrationService.passwordRecovery(passwordRecoveryRequest);
        return AppResponseEntity.success(constantConfig.getPasswordRecoverySuccess().get("kaz"));
    }

    @PostMapping("/mainDataChange")
    public ResponseEntity<?> mainDataChange(@Valid @RequestBody MainDataChangeRequest mainDataChangeRequest) {
        registrationService.mainDataChange(mainDataChangeRequest);
        return AppResponseEntity.success(constantConfig.getMainDataChangeSuccess().get("kaz"));
    }

    @PostMapping("/passwordReset")
    public ResponseEntity<?> passwordReset(@Valid @RequestBody PasswordResetRequest request) {
        registrationService.passwordReset(request);
        return AppResponseEntity.success(constantConfig.getPasswordResetSuccess().get("kaz"));
    }

    @ExceptionHandler
    public ResponseEntity<?> handleException(Error ex) {
        return new ResponseEntity<>(new ErrorPojo(HttpStatus.BAD_REQUEST.value(), ex.getMessage()), HttpStatus.BAD_REQUEST);
    }


}
