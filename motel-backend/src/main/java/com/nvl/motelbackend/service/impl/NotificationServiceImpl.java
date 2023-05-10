package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.entity.Notification;
import com.nvl.motelbackend.entity.NotificationName;
import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.exception.MotelAPIException;
import com.nvl.motelbackend.exception.ResourceNotFoundException;
import com.nvl.motelbackend.model.NotificationDTO;
import com.nvl.motelbackend.repository.NotificationRepository;
import com.nvl.motelbackend.repository.UserRepository;
import com.nvl.motelbackend.service.EmailService;
import com.nvl.motelbackend.service.ImageService;
import com.nvl.motelbackend.service.NotificationService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.time.LocalDateTime;


@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final  UserRepository userRepository;
    private final  ImageService imageService;

    @Autowired
    private EmailService emailService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    ModelMapper mapper = new ModelMapper();


    public void sendNotification(NotificationDTO notificationDTO) {
        messagingTemplate.convertAndSend(
                "/user/" + notificationDTO.getUser().getEmail() + "/queue/notifications",
                notificationDTO
        );
    }

    public void sendEmail(String email, String body) throws MessagingException {
        String subject = "Duyệt bài đăng";
        emailService.sendEmail(email, subject, body);
    }

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository, ImageService imageService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.imageService = imageService;
    }

    @Override
    public NotificationDTO createNotification(User user, Post post, NotificationName notificationName) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setPost(post);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setNotificationName(notificationName);
        notification.setSeen(notificationName == NotificationName.NOTIFICATION);
        Notification notificationRes = notificationRepository.save(notification);
        return notificationToNotificationDTO(notificationRes);
    }

//    @Override
//    public Page<NotificationDTO> getNotificationByUser(String email, int page) {
//        User user = userRepository.findByEmail(email).orElseThrow(() -> new MotelAPIException(HttpStatus.NOT_FOUND, "User with email: " + email + " not found");)
//        Page<Notification> notificationPage = notificationRepository.findAllByUser(user, PageRequest.of(page, 10));
//        return notificationPage.map(this::notificationToNotificationDTO);
//    }

    @Override
    public Page<NotificationDTO> getNotificationByEmail(String email, Boolean seen, Pageable page) {
        Page<Notification> notificationPage = null;
        User user = userRepository.findByEmail(email).orElseThrow(() -> new MotelAPIException(HttpStatus.NOT_FOUND, "User with email: " + email + " not found"));
        if (seen != null) {
            notificationPage = notificationRepository.findAllByUserAndSeen(user, seen, page);
        }
        else {
            notificationPage = notificationRepository.findAllByUser(user, page);
        }

        return notificationPage.map(this::notificationToNotificationDTO);
    }

    @Override
    public NotificationDTO seenNotification(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        notification.setSeen(true);
        return notificationToNotificationDTO(notificationRepository.save(notification));
    }

    public NotificationDTO notificationToNotificationDTO(Notification notification) {
        NotificationDTO notificationDTO = mapper.map(notification, NotificationDTO.class);
//        notificationDTO.setPostDTO(mapper.map(notification.getPost(), PostDTO.class));
//        List<String> images = imageService.getImageByPostId(notification.getPost().getId());
//        notificationDTO.getPostDTO().setImageStrings(images);
//        notificationDTO.getPostDTO().setUserDTO(modelMapper.map(notification.getPost().getUser(), UserDTO.class));
        return notificationDTO;
    }
}
