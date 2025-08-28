package kz.inessoft.nabrk.elcat.service;

import kz.inessoft.nabrk.dao.dto.ReaderInfo;
import kz.inessoft.nabrk.dao.repository.ReaderRepository;
import kz.inessoft.nabrk.elcat.service.auth.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    ReaderRepository readerRepository;

    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        ReaderInfo userInfo = readerRepository.findReaderByUserName(login);
        return new UserDetailsImpl(userInfo.userName, userInfo.email, null, Collections.emptyList(), Collections.emptyList());
    }
}
