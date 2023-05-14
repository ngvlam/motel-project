package com.nvl.motelbackend.config;


import com.nvl.motelbackend.entity.NotificationName;
import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.model.NotificationDTO;
import com.nvl.motelbackend.service.NotificationService;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;

@Component
public class NotificationEventListener implements ApplicationListener<NotificationEvent> {
    private final NotificationService notificationService;

    public NotificationEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public void onApplicationEvent(NotificationEvent notificationEvent) {
        Post post = notificationEvent.getPost();
        NotificationDTO notificationDTO;
        String emailSubject;

        if (post.isApproved()) {
            notificationDTO = notificationService.createNotification(post.getUser(), post, NotificationName.APPROVE);
        } else {
            notificationDTO = notificationService.createNotification(post.getUser(), post, NotificationName.BLOCK);
        }
        notificationService.sendNotification(notificationDTO);

        //Gửi email
        try {
            String emailContent = getEmailContent(post.isApproved(), post.getTitle());
            notificationService.sendEmail(post.getUser().getEmail(), emailContent);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

    }
    private String getEmailContent(boolean isApproved, String postTitle) {
        String emailContent;
        if (isApproved) {
            emailContent = "Bài đăng <b>" + postTitle + "</b> của bạn đã được duyệt.";
        } else {
            emailContent = "Bài đăng <b>" + postTitle + "</b> của bạn đã được duyệt.";
        }
        return emailContent;
    }
}
