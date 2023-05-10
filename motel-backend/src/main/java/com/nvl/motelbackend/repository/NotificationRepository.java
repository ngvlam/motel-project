package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Notification;
import com.nvl.motelbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findAllByUser(User user, Pageable page);
    Page<Notification> findAllByUserAndSeen(User user, Boolean seen, Pageable page);
}
