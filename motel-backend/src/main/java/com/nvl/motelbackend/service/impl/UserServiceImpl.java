package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.entity.Role;
import com.nvl.motelbackend.entity.RoleName;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.exception.MotelAPIException;
import com.nvl.motelbackend.exception.ResourceNotFoundException;
import com.nvl.motelbackend.model.AccountDTO;
import com.nvl.motelbackend.model.UserDTO;
import com.nvl.motelbackend.repository.RoleRepository;
import com.nvl.motelbackend.repository.UserRepository;
import com.nvl.motelbackend.service.UserService;
import com.nvl.motelbackend.utils.UserUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    ModelMapper mapper = new ModelMapper();

//    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public Page<UserDTO> getPageOfUsersByRoles(Pageable page, String query, List<String> rolesString) {
        List<Role> roles = rolesString.stream()
                .map(RoleName::valueOf)
                .map(this::getRoleByName).collect(Collectors.toList());
        if(query == null) {
            return userRepository.findAllByRolesIn(page, roles).map(this::mapToDTOWithRoles);
        }
        return userRepository.searchUser(query, roles, page).map(this::mapToDTOWithRoles);
    }

    @Override
    public UserDTO getUserByEmail(String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new MotelAPIException(HttpStatus.NOT_FOUND, "User not found"));
        return mapToDTOWithRoles(user);
    }

    @Override
    public Role getRoleByName(RoleName name) {
        return roleRepository.findByName(name);
    }

    @Override
    public UserDTO changePassword(Long id, String newPassword, String oldPassword, Authentication authentication) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "User", id));

        UserUtils.checkUpdateProfileAuthorization(id, authentication);

        if (authentication.getAuthorities().stream().anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_USER"))) {
            if (!passwordEncoder.matches(oldPassword, user.getPassword()))
                throw new MotelAPIException(HttpStatus.FORBIDDEN, "Old password is not match");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        return mapToDTOWithRoles(userRepository.save(user));
    }

    @Override
    public UserDTO blockUserById(Long id, boolean block) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "User", id));
        user.setBlock(block);
        User userNew = userRepository.save(user);
        return mapToDTOWithRoles(userNew);
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "User", id));
        return mapToDTOWithRoles(user);
    }

    @Override
    public UserDTO updateProfile(UserDTO userDTO, long id, Authentication authentication) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "User", id));

        UserUtils.checkUpdateProfileAuthorization(id, authentication);

        user.setPhone(userDTO.getPhone());
        user.setFullName(userDTO.getFullName());
        user.setAddress(userDTO.getAddress());
        user.setB64(userDTO.getB64());
        User updatedUser = userRepository.save(user);
        return mapToDTOWithRoles(updatedUser);
    }

    @Override
    public UserDTO updateRole(Long id, List<RoleName> roles) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "User", id));
        user.setRoles(roles.stream().map(this::getRoleByName).collect(Collectors.toSet()));
        return mapToDTO(userRepository.save(user));
    }

    @Override
    public UserDTO addUser(AccountDTO accountDTO) {
        if (userRepository.existsByEmail(accountDTO.getEmail())) {
            throw new MotelAPIException(HttpStatus.CONFLICT, "Email đã tồn tại");
        }
        User user = new User();

        if (accountDTO.getFullName().trim().length() <= 0)
            user.setFullName(user.getEmail());
        else
            user.setFullName(accountDTO.getFullName());

        user.setEmail(accountDTO.getEmail());
        user.setAddress(accountDTO.getAddress());
        user.setPhone(accountDTO.getPhone());
        user.setPassword(passwordEncoder.encode(accountDTO.getPassword()));
        user.setB64(accountDTO.getB64());

        if (accountDTO.getRoles() != null && !accountDTO.getRoles().isEmpty()) {
            user.setRoles(accountDTO.getRoles().stream().map(this::getRoleByName).collect(Collectors.toSet()));
        } else {
            user.setRoles(Set.of(getRoleByName(RoleName.ROLE_USER)));
        }

        return mapToDTOWithRoles(userRepository.save(user));
    }

    @Override
    public void changeAvatar(Long id, byte[] fileBytes) {

    }

    private UserDTO mapToDTO(User user) {
        return mapper.map(user, UserDTO.class);
    }

    private UserDTO mapToDTOWithRoles(User user) {
        UserDTO userDTO = mapToDTO(user);
        userDTO.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
        return userDTO;
    }
}
