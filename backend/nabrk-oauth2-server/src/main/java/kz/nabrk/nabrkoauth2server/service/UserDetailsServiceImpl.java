package kz.nabrk.nabrkoauth2server.service;

import kz.nabrk.nabrkoauth2server.models.User;
import kz.nabrk.nabrkoauth2server.models.UserGroup;
import kz.nabrk.nabrkoauth2server.models.artifact.AppReader;
import kz.nabrk.nabrkoauth2server.repository.UserRepository;
import kz.nabrk.nabrkoauth2server.repository.artifact.AppReaderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserRolesService userRolesService;

    @Autowired
    AppReaderRepository readerRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        List<UserGroup> roles = userRolesService.loadRoles(user);
        AppReader reader = readerRepository.findByUserName(username).orElse(new AppReader());
        return UserDetailsImpl.build(user, roles, reader);
    }


}
