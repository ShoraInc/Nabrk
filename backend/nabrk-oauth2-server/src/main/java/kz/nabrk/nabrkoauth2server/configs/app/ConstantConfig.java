package kz.nabrk.nabrkoauth2server.configs.app;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import java.util.Map;


@Validated
@Data
@Component
@PropertySource(value = "classpath:messages.yml", encoding = "UTF-8", factory = YamlPropertySourceFactory.class)
@ConfigurationProperties(prefix = "app-lang")
public class ConstantConfig {
    Map<String, String> langIndexes;

    Map<String, String> registrationSuccess;

    Map<String, String> passwordResetSuccess;

    Map<String, String> mainDataChangeSuccess;

    Map<String, String> registrationErrorEmailExist;

    Map<String, String> registrationErrorEmailNotFound;

    Map<String, String> registrationErrorAccountNotFound;

    Map<String, String> passwordRecoverySuccess;

    Map<String, String> passwordRecoveryNeedEmailOrId;

    Map<String, String> authenticationNeedError;

    Map<String, String> accessPermitError;

    Map<String, String> errorRegistrationUserNotFound;

    Map<String, String> errorBadCredentials;

    Map<String, String> errorBadPassword;

    Map<String, String> errorPasswordNotMatch;
}
