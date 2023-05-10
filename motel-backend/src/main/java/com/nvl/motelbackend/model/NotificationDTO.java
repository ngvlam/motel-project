package com.nvl.motelbackend.model;

import com.nvl.motelbackend.entity.NotificationName;
import com.nvl.motelbackend.entity.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long id;

    private PostDTO post;
    private UserDTO user;

    private boolean seen;

    private LocalDateTime createdAt;

    private NotificationName notificationName;
}
