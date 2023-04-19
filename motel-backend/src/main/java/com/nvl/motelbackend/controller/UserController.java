package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.entity.RoleName;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.model.AccountDTO;
import com.nvl.motelbackend.model.UserDTO;
import com.nvl.motelbackend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.AbstractMap;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public Page<UserDTO> getAlLUser(@PageableDefault(page = 0, size = 10) Pageable page,
                                    @RequestParam(name = "query", required = false) String query,
                                    @RequestParam(value = "roles", defaultValue = "") List<String> roles) {
        return userService.getPageOfUsersByRoles(page, query, roles);
    }

    @GetMapping ("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable("id") Long id) {
        UserDTO userDTO = userService.getUserById(id);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/{id}/avatar")
    public AbstractMap.SimpleEntry<String, String> getAvatar(@PathVariable("id") Long id) {
//        if (!validRequest(auth, id)) throw new AccessDeniedException("Access dined");
        return new AbstractMap.SimpleEntry<>("data", userService.getUserById(id).getB64());
    }

    @PostMapping
    public ResponseEntity<UserDTO> addUser(@Valid @RequestBody AccountDTO accountDTO) {
        UserDTO newUserDTO = userService.addUser(accountDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUserDTO);
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<UserDTO> blockUser(@PathVariable("id") Long id) {
        UserDTO userDTO = userService.blockUserById(id, true);

        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/{id}/unblock")
    public ResponseEntity<UserDTO> unblockUser(@PathVariable("id") Long id) {
        UserDTO userDTO = userService.blockUserById(id, false);

        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateProfile(@PathVariable("id") Long id,
                                      @RequestBody UserDTO userDTO) {
        UserDTO userRes = userService.updateProfile(userDTO, id);

        return ResponseEntity.ok(userRes);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserDTO> updateRole(@PathVariable("id") Long id, @RequestBody List<RoleName> roles) {
        UserDTO userRes = userService.updateRole(id, roles);
        return ResponseEntity.ok(userRes);
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<UserDTO> changePassword(@PathVariable("id") Long id,
                                                  @RequestParam("password") String newPassword,
                                                  @RequestParam(value = "oldPassword", defaultValue = "") String oldPassword) {
//        User authUser = userService.getUserByEmail(auth.getName());
//        if (authUser.getRoles().stream().map(Role::getName).anyMatch(roleName -> roleName == RoleName.ROLE_ADMIN)) {
//            role = "ROLE_ADMIN";
//        } else {
//            role = "ROLE_USER";
//        }
        UserDTO userRes = userService.changePassword(id, newPassword, oldPassword, "ROLE_ADMIN");
        return ResponseEntity.ok(userRes);
    }
}
