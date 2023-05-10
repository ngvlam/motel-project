package com.nvl.motelbackend.service;

import com.nvl.motelbackend.entity.Notification;
import com.nvl.motelbackend.entity.NotificationName;
import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.model.NotificationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.mail.MessagingException;

public interface NotificationService {
    void sendNotification(NotificationDTO notificationDTO);
    NotificationDTO createNotification(User user, Post post, NotificationName notificationName);

//    Page<NotificationDTO> getNotificationByUser(String email, int page);

    void sendEmail(String email, String body) throws MessagingException;
    Page<NotificationDTO> getNotificationByEmail(String email, Boolean seen, Pageable page);

    NotificationDTO seenNotification(Long id);
}
