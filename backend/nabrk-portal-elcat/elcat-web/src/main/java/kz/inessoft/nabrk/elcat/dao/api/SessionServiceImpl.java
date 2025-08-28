package kz.inessoft.nabrk.elcat.dao.api;

import kz.inessoft.nabrk.dao.api.*;
import kz.inessoft.nabrk.dao.repository.DepUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import static kz.inessoft.nabrk.dao.api.Role.values;

@Component
//public class SessionServiceImpl {
public class SessionServiceImpl implements SessionService {
    @Autowired
    List<Repository> repositories;
    Map<String, Repository> repositoriesMap = null;

    @Autowired
    private SessionInfo request;

    @Autowired
    DepUserRepository depUserRepository;

    public Repository findRepository(String name) {
        initRepositoriesMap();
        String name_ = name.toLowerCase();
        if (this.repositoriesMap.containsKey(name_)) {
            return this.repositoriesMap.get(name_);
        }
        throw new ResourceNotFoundException();
    }

    public Repository findRepository(String name, Operation operation) {
        final Repository repository = findRepository(name);
        repository.checkAccess(operation);
        return repository;
    }

    private void initRepositoriesMap() {
        if (this.repositoriesMap != null &&
                this.repositoriesMap.size() == this.repositories.size()) {
            return;
        }
        this.repositoriesMap = this.repositoriesMap == null ? new LinkedHashMap<>() : this.repositoriesMap;
        for (Repository repository : repositories) {
            //            String n  ame = repository.getRepositoryName().toLowerCase();
            String name = repository.getClass().getSimpleName().split("\\$")[0];
            this.repositoriesMap.put(name.toLowerCase(), repository);
        }
    }


    public String getUserName() {
        return request.getRemoteUser();
    }

    public List<String> getRoleNames() {
        List<String> roles = new LinkedList<String>();

        for (Role role : values()) {
            if (request.isUserInRole(role.name())) {
                roles.add(role.name());
            }
        }
        // /workspace/rest/access/ResupplyReaderRepository
        return roles;
    }

    public List<Role> getRoles() {
        List<Role> roles = new LinkedList<Role>();
        for (Role role : values()) {
            if (request.isUserInRole(role.name())) roles.add(role);
        }
        return roles;
    }

    public boolean inRole(Role... roles) {
        for (Role role : roles) {
            if (request.isUserInRole(role.name())) return true;
        }
        return false;
    }

    public void check(Role... roles) {
//        Arrays.asList(roles).forEach(role -> {
//            System.out.println(role.toString());
//        });
        System.out.println("roles for check");
        System.out.println(roles);
        if (!inRole(roles)) {
            throw new RuntimeException("access denied");
        }
    }

    public List<String> availableDepCodes() {
        String userName = getUserName();
        return depUserRepository.getDepByUser(userName, false);
    }

}
