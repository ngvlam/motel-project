package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.entity.RoleName;
import com.nvl.motelbackend.model.AccountDTO;
import com.nvl.motelbackend.model.UserDTO;
import com.nvl.motelbackend.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.AbstractMap;
import java.util.List;

@Api(value = "Rest API người dùng")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/current")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(userService.getUserByEmail(authentication.getName()));
    }

    @ApiOperation("Lấy danh sách người dùng")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Page<UserDTO> getAlLUser(@PageableDefault(page = 0, size = 10) Pageable page,
                                    @RequestParam(name = "query", required = false) String query,
                                    @RequestParam(value = "roles", defaultValue = "") List<String> roles) {
        return userService.getPageOfUsersByRoles(page, query, roles);
    }

    @ApiOperation("Lấy một người dùng theo mã")
    @GetMapping ("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable("id") Long id) {
        UserDTO userDTO = userService.getUserById(id);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/{id}/avatar")
    public AbstractMap.SimpleEntry<String, String> getAvatar(@PathVariable("id") Long id) {
        return new AbstractMap.SimpleEntry<>("data", userService.getUserById(id).getB64());
    }

    @ApiOperation("Thêm một người dùng mới")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UserDTO> addUser(@Valid @RequestBody AccountDTO accountDTO) {
        UserDTO newUserDTO = userService.addUser(accountDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUserDTO);
    }

    @ApiOperation("Khóa một người dùng")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/block")
    public ResponseEntity<UserDTO> blockUser(@PathVariable("id") Long id) {
        UserDTO userDTO = userService.blockUserById(id, true);

        return ResponseEntity.ok(userDTO);
    }

    @ApiOperation("Mở khóa một người dùng")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/unblock")
    public ResponseEntity<UserDTO> unblockUser(@PathVariable("id") Long id) {
        UserDTO userDTO = userService.blockUserById(id, false);

        return ResponseEntity.ok(userDTO);
    }

    @ApiOperation("Cập nhật người dùng")
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateProfile(@PathVariable("id") Long id,
                                                 @RequestBody UserDTO userDTO, Authentication authentication) {
        UserDTO userRes = userService.updateProfile(userDTO, id, authentication);

        return ResponseEntity.ok(userRes);
    }

    @ApiOperation("Cập nhật quyền của người dùng")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/role")
    public ResponseEntity<UserDTO> updateRole(@PathVariable("id") Long id, @RequestBody List<RoleName> roles) {
        UserDTO userRes = userService.updateRole(id, roles);
        return ResponseEntity.ok(userRes);
    }


    @ApiOperation("Thay đổi mật khẩu người dùng")
    @PutMapping("/{id}/password")
    public ResponseEntity<UserDTO> changePassword(@PathVariable("id") Long id,
                                                  @RequestParam("password") String newPassword,
                                                  @RequestParam(value = "oldPassword", defaultValue = "") String oldPassword,
                                                  Authentication authentication) {
//        User authUser = userService.getUserByEmail(auth.getName());
//        if (authUser.getRoles().stream().map(Role::getName).anyMatch(roleName -> roleName == RoleName.ROLE_ADMIN)) {
//            role = "ROLE_ADMIN";
//        } else {
//            role = "ROLE_USER";
//        }
        UserDTO userRes = userService.changePassword(id, newPassword, oldPassword, authentication);
        return ResponseEntity.ok(userRes);
    }
}
