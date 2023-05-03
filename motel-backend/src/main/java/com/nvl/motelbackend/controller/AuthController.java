package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.entity.Role;
import com.nvl.motelbackend.entity.RoleName;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.exception.MotelAPIException;
import com.nvl.motelbackend.model.AccountDTO;
import com.nvl.motelbackend.model.JWTAuthResponse;
import com.nvl.motelbackend.model.UserDTO;
import com.nvl.motelbackend.repository.RoleRepository;
import com.nvl.motelbackend.repository.UserRepository;
import com.nvl.motelbackend.security.JwtTokenProvider;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.stream.Collectors;

@Api(value = "Auth controller exposes signin and signup REST APIs")
@RestController
@RequestMapping("/api/auth")
public class AuthController{
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    ModelMapper mapper = new ModelMapper();
    public AuthController(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @ApiOperation(value = "Đăng nhập")
    @PostMapping("/signin")
    public ResponseEntity<JWTAuthResponse> authenticateUser(@RequestBody AccountDTO accountDTO) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                accountDTO.getEmail(), accountDTO.getPassword()
        ));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new JWTAuthResponse(token));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody AccountDTO accountDTO) {
        if (userRepository.existsByEmail(accountDTO.getEmail())) {
            throw new MotelAPIException(HttpStatus.CONFLICT, "Email đã tồn tại");
        }

        User user = new User();
        if (accountDTO.getFullName().trim().length() <= 0)
            user.setFullName(user.getEmail());
        else
            user.setFullName(accountDTO.getFullName());

        user.setEmail(accountDTO.getEmail());
        user.setPassword(passwordEncoder.encode(accountDTO.getPassword()));
        user.setRoles(Set.of(getRoleByName(RoleName.ROLE_USER)));

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTOWithRoles(userRepository.save(user)));
    }

    public Role getRoleByName(RoleName name) {
        return roleRepository.findByName(name);
    }

    private UserDTO mapToDTOWithRoles(User user) {
        UserDTO userDTO = mapper.map(user, UserDTO.class);
        userDTO.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
        return userDTO;
    }
}
