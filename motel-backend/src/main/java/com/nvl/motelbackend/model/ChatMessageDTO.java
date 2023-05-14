package com.nvl.motelbackend.model;

import com.nvl.motelbackend.entity.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessageDTO {
    private Long id;
//    private Long senderId;
    private UserDTO receiver;
    private String messageContent;
    private LocalDateTime sentAt;
}
