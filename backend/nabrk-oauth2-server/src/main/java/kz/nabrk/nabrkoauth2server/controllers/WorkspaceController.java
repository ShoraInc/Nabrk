package kz.nabrk.nabrkoauth2server.controllers;

import kz.nabrk.nabrkoauth2server.ResponseException;
import kz.nabrk.nabrkoauth2server.enums.WorkspaceRoles;
import kz.nabrk.nabrkoauth2server.models.User;
import kz.nabrk.nabrkoauth2server.service.artifact.WorkspaceService;
import kz.nabrk.nabrkoauth2server.service.authentication.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kz.nabrk.nabrkoauth2server.enums.WorkspaceRoles;
import org.springframework.web.client.HttpClientErrorException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/api/workspace")
public class WorkspaceController {
    @Autowired
    WorkspaceService workspaceService;
    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("/userActivation/{userId}/{password}/{email}")
    public ResponseEntity<?> userActivation(@PathVariable String userId, @PathVariable String password, @PathVariable String email) {
        //
        authenticationService.getIfHasRoles(WorkspaceRoles.user_management);
        //
        workspaceService.userActivation(
                userId,
                email,
                password
        );

        return ResponseEntity.ok(
                "Активация прошла успешна"
        );
    }


}
