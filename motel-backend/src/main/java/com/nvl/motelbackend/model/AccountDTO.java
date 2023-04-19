package com.nvl.motelbackend.model;

import com.nvl.motelbackend.entity.RoleName;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@NoArgsConstructor
public class AccountDTO {

    @NotEmpty(message = "Email không được để trống")
    private String email;

    @NotEmpty()
    @Size(min = 8, message = "Mật khẩu phải từ 8 ký tự trở lên")
    private String password;

    @NotEmpty
    @Size(min = 2, message = "Họ và tên phải từ 2 ký tự trở lên")
    private String fullName;

    private String address;

    private String phone;

    private String b64;

    private List<RoleName> roles;
}
