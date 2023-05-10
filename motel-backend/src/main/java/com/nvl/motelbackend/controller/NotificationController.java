package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.model.NotificationDTO;
import com.nvl.motelbackend.service.NotificationService;
import com.nvl.motelbackend.utils.NotificationUtils;
import com.nvl.motelbackend.utils.UserUtils;
import io.swagger.annotations.ApiOperation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @ApiOperation(value = "Lấy một trang thông báo của người dùng")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MODERATOR')")
    @GetMapping()
    public Page<NotificationDTO> getNotificationByEmail(Authentication authentication, @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable page, @RequestParam(required = false) Boolean seen) {
        return notificationService.getNotificationByEmail(authentication.getName(), seen, page);
    }

//    @ApiOperation(value = "Lấy thông báo đã xem hay chưa xem")
//    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MODERATOR')")
//    @GetMapping("/{seen}")
//    public Page<NotificationDTO> getNotificationBySeen(Authentication authentication, Pageable page) {
//        return n
//    }

    @ApiOperation(value = "Đánh dấu thông báo đã xem")
    @PutMapping("/{id}")
    public NotificationDTO seenNotification(@PathVariable long id) {
        return notificationService.seenNotification(id);
    }
}
