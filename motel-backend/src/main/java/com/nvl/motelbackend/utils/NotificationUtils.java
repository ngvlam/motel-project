package com.nvl.motelbackend.utils;

import com.nvl.motelbackend.entity.Notification;
import com.nvl.motelbackend.exception.MotelAPIException;
import com.nvl.motelbackend.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

public class NotificationUtils {
    public static void checkNotificationOwnerShip(Notification notification, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        if (!notification.getUser().getId().equals(userDetails.getId())) {
            throw new MotelAPIException(HttpStatus.FORBIDDEN, "Access denied");
        }
    }
}
