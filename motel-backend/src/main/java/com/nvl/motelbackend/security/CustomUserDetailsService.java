package com.nvl.motelbackend.security;

import com.nvl.motelbackend.entity.Role;
import com.nvl.motelbackend.entity.RoleName;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsService.class.getSimpleName());

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("load user with username={}", username);
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        return new CustomUserDetails(user.getId(), user.getEmail(), user.getPassword(), !user.isBlock(),
                AuthorityUtils.createAuthorityList(
                        user.getRoles().stream().map(Role::getName)
                                .map(RoleName::toString)
                                .toArray(String[]::new)));
    }

}
