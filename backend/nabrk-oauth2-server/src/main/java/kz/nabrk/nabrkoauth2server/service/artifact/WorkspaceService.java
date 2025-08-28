package kz.nabrk.nabrkoauth2server.service.artifact;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import kz.nabrk.nabrkoauth2server.models.User;
import kz.nabrk.nabrkoauth2server.models.artifact.AppReader;
import kz.nabrk.nabrkoauth2server.pojo.request.PasswordRecoveryRequest;
import kz.nabrk.nabrkoauth2server.pojo.request.RegistrationRequest;
import kz.nabrk.nabrkoauth2server.repository.UserRepository;
import kz.nabrk.nabrkoauth2server.repository.artifact.AppReaderRepository;
import kz.nabrk.nabrkoauth2server.service.mail.CustomMailService;
import kz.nabrk.nabrkoauth2server.utils.WorkspaceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import javax.validation.constraints.NotNull;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class WorkspaceService {
    @Autowired
    AppReaderRepository appReaderRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    CustomMailService customMailService;

    @Autowired
    WorkspaceUtils workspaceUtils;

    public void userActivation(String userName, String email, String password) {
        customMailService.sendRegistrationMessage(
                userName,
                email,
                password
        );
    }
}
