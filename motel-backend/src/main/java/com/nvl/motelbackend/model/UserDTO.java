package com.nvl.motelbackend.model;

import com.nvl.motelbackend.entity.RoleName;
import lombok.Data;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;

@Data
public class UserDTO {
    private Long id;

    private String fullName;

    private String email;

    private String address;

    private String phone;

    private boolean block;

    private String b64;

    private String fileType;
    private double balance;

    @Enumerated(EnumType.STRING)
    private List<RoleName> roles;
}
