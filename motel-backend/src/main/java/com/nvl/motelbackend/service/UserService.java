package com.nvl.motelbackend.service;

import com.nvl.motelbackend.entity.Role;
import com.nvl.motelbackend.entity.RoleName;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.model.AccountDTO;
import com.nvl.motelbackend.model.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface UserService {

    Page<UserDTO> getPageOfUsersByRoles(Pageable page, String query, List<String> rolesString);

    UserDTO getUserByEmail(String username);

    Role getRoleByName(RoleName name);

    UserDTO changePassword(Long id, String newPassword, String oldPassword, Authentication authentication);

    UserDTO blockUserById(Long id, boolean block);

    UserDTO getUserById(Long id);

    UserDTO updateProfile(UserDTO userDTO, long id, Authentication authentication);

    UserDTO updateRole(Long id, List<RoleName> role);

    UserDTO addUser(AccountDTO accountDTO);

    void changeAvatar(Long id, byte[] fileBytes);
}
