package kz.nabrk.nabrkoauth2server.service.artifact;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import kz.nabrk.nabrkoauth2server.configs.app.ConstantConfig;
import kz.nabrk.nabrkoauth2server.models.User;
import kz.nabrk.nabrkoauth2server.models.artifact.AppReader;
import kz.nabrk.nabrkoauth2server.pojo.request.MainDataChangeRequest;
import kz.nabrk.nabrkoauth2server.pojo.request.PasswordRecoveryRequest;
import kz.nabrk.nabrkoauth2server.pojo.request.PasswordResetRequest;
import kz.nabrk.nabrkoauth2server.pojo.request.RegistrationRequest;
import kz.nabrk.nabrkoauth2server.repository.UserRepository;
import kz.nabrk.nabrkoauth2server.repository.artifact.AppReaderRepository;
import kz.nabrk.nabrkoauth2server.service.mail.CustomMailService;
import kz.nabrk.nabrkoauth2server.utils.WorkspaceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

@Service
public class RegistrationService {
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

    @Autowired
    ConstantConfig constantConfig;

    void validate(RegistrationRequest registrationRequest) {
        if (registrationRequest.getEmail() == null) {
            throw new Error("Email обязательно для заполнения.");
        } else if (registrationRequest.getFirstName() == null) {
            throw new Error("Имя обязательно для заполнения.");
        } else if (registrationRequest.getYearOfBirth() == null) {
            throw new Error("Email обязательно для заполнения.");
        } else if (registrationRequest.getLastName() == null) {
            throw new Error("Фамилия обязательно для заполнения.");
        }
    }

    private AppReader loadByEmailOrUserId(String email, String userName) {
        AppReader reader;
        if (userName != null && !userName.trim().equals("")) {
            reader = appReaderRepository.findByUserName(userName).orElse(null);
        } else if (email != null && !email.trim().equals("")) {
            reader = appReaderRepository.findByEmail(email).orElse(null);
        } else {
            throw new Error(constantConfig.getPasswordRecoveryNeedEmailOrId().get("kaz"));
        }
        if (reader == null) {
            throw new Error(constantConfig.getRegistrationErrorAccountNotFound().get("kaz"));
        } else if (reader.getEmail() == null) {
            throw new Error(constantConfig.getErrorRegistrationUserNotFound().get("kaz"));
        }
        return reader;
    }

    public Map<String, String> passwordRecovery(PasswordRecoveryRequest request) {
        AppReader reader = loadByEmailOrUserId(request.getEmail(), request.getUserName());
        String password = workspaceUtils.generatePassword();
//        password = "Gfhjkmbiblio";
        User user = userRepository.findByUserName(reader.getUserName()).orElseThrow(
                () -> new Error(constantConfig.getErrorRegistrationUserNotFound().get("kaz"))
        );
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        customMailService.sendRecoveryPassword(user.getUserName(), reader.getEmail(), password);

        //
        Map<String, String> result = new LinkedHashMap<>();
        result.put("newPassword", password);
        result.put("userName", user.getUserName());
        return result;
    }

    public void mainDataChange(MainDataChangeRequest request) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        AppReader appReader = appReaderRepository.findByUserName(username).orElseThrow(
                () -> new Error(constantConfig.getErrorRegistrationUserNotFound().get("kaz"))
        );
        String email = request.getEmail();
        if (!email.equals(appReader.getEmail())) {
            User user = userRepository.findByUserName(username).orElseThrow(
                    () -> new Error(constantConfig.getErrorRegistrationUserNotFound().get("kaz"))
            );
            if (appReaderRepository.existsByEmail(email) || userRepository.existsByEmail(email)) {
                throw new Error(constantConfig.getRegistrationErrorEmailExist().get("kaz"));
            }
            user.setEmail(email);
            userRepository.save(user);

            appReader.setEmail(email);
        }
        appReader.setFirstName(request.getFirstName());
        appReader.setLastName(request.getLastname());
        appReaderRepository.save(appReader);
    }

    public void passwordReset(PasswordResetRequest request) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByUserName(username).orElseThrow(
                () -> new Error(constantConfig.getErrorRegistrationUserNotFound().get("kaz"))
        );
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new Error(constantConfig.getErrorBadPassword().get("kaz"));
        }
        if (!request.getNewPassword().equals(request.getCheckPassword())) {
            throw new Error(constantConfig.getErrorPasswordNotMatch().get("kaz"));
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void registration(RegistrationRequest registrationRequest) {
        validate(registrationRequest);
        if (appReaderRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new Error(constantConfig.getRegistrationErrorEmailExist().get("kaz"));
        }

        //
        String userName = appReaderRepository.getNextVal().toString();
        long currentTimeMillis = System.currentTimeMillis();
        Date currentDate = new Date(currentTimeMillis);
        Time currentTime = new Time(currentTimeMillis);

        //
        ObjectMapper objectMapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        AppReader reader = objectMapper.convertValue(registrationRequest, AppReader.class);
        reader.setEducationTypeId(registrationRequest.getEducationId());
        reader.setUserName(userName);
        reader.setBarCode(workspaceUtils.generateBarCode(userName));
        reader.setReaderStatusId(Short.parseShort("2"));
        reader.setSocialStatusGroupId(registrationRequest.getSocialStatusId());

        reader.setRegistrationDate(currentDate);
        reader.setRegistrationTime(currentTime);
        reader.setEditingDate(currentDate);
        reader.setEditingTime(currentTime);
        appReaderRepository.save(reader);

        System.out.println(reader);
    }
}
