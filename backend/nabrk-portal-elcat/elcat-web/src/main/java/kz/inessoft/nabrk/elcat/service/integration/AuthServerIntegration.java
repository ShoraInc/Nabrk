package kz.inessoft.nabrk.elcat.service.integration;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kz.inessoft.nabrk.elcat.dao.api.ServletSessionInfo;
import kz.inessoft.nabrk.elcat.exception.IntegrationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class AuthServerIntegration {

    @Autowired
    ServletSessionInfo servletSessionInfo;

    final RestTemplate restTemplate = new RestTemplate();

    @Value("${api.oauth2.server.url}")
    String apiOauth2ServerUrl;

    @Value("${api.oauth2.server.userActivation}")
    String apiUserActivation;


    public void activateUser(String userName, String password, String email) throws JsonProcessingException, IntegrationException {
        String url = apiOauth2ServerUrl + apiUserActivation + "/" + userName + "/" + password + "/" + email;
        HttpEntity<?> entity = createRequestEntity(null);
        try {
            ResponseEntity<?> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
//            System.out.println(response.getStatusCode());
//            System.out.println(response.getBody());
        } catch (HttpClientErrorException e) {
            ObjectMapper objectMapper = new ObjectMapper();
            String error = e.getResponseBodyAsString();
            Map response = objectMapper.readValue(error, Map.class);
            throw new IntegrationException(response.get("message").toString());
        }
    }

    private HttpEntity<?> createRequestEntity(Object requestBody) {
        String token = servletSessionInfo.getUserDetails().getJwt();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("Authorization", "Bearer " + token);
        return new HttpEntity<>(requestBody, headers);
    }

}
