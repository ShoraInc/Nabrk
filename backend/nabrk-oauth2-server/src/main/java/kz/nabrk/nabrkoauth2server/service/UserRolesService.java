package kz.nabrk.nabrkoauth2server.service;


import kz.nabrk.nabrkoauth2server.models.User;
import kz.nabrk.nabrkoauth2server.models.UserGroup;
import kz.nabrk.nabrkoauth2server.repository.UserRepository;
import kz.nabrk.nabrkoauth2server.repository.UserGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class UserRolesService {

    @Autowired
    UserGroupRepository userGroupRepository;

    @Autowired
    UserRepository userRepository;

    void saveRoles(User user, Set<String> roles) {
        String userName = user.getUserName();
        roles.stream().forEach(groupName -> {
            UserGroup role = userGroupRepository.findByUserNameAndUserGroup(userName, groupName).orElse(new UserGroup(userName, groupName));
            if (role.getId() == null) {
                userGroupRepository.save(role);
            }
        });
    }

    List<UserGroup> loadRoles(String userName) {
        return loadRoles(userRepository.findByUserName(userName).orElseGet(null));
    }

    List<UserGroup> loadRoles(User user) {
        if (user == null) {
            return new ArrayList<>();
        }
        return userGroupRepository.findAllByUserName(user.getUserName());
    }

}
