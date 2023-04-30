package com.nvl.motelbackend.utils;

import com.nvl.motelbackend.exception.MotelAPIException;
import com.nvl.motelbackend.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class UserUtils {
    public static void checkUpdateProfileAuthorization(Long userId, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            if (!userId.equals(userDetails.getId()) && !authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
                throw new MotelAPIException(HttpStatus.FORBIDDEN, "Access dined");
            }
    }
}
