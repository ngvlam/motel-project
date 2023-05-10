package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.entity.ChatMessage;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.model.ChatMessageDTO;
import com.nvl.motelbackend.model.UserDTO;
import com.nvl.motelbackend.security.CustomUserDetails;
import com.nvl.motelbackend.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class ChatController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/messages/users")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MODERATOR')")
    public Set<UserDTO> getAllReceiver(Authentication authentication) {
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        return chatService.getAllReceiverBySender(user.getId());
    }

    @GetMapping("/messages")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MODERATOR')")
    public List<ChatMessageDTO> getMessages(Authentication authentication, @RequestParam("receiver") Long receiverId) {
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        return chatService.getMessages(user.getId(), receiverId);
    }

    @PostMapping("/messages")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MODERATOR')")
    public void sendMessage(@RequestBody ChatMessageDTO chatMessage) {
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiver().getEmail(),
                "/topic/messages",
                chatMessage
        );
    }

    @MessageMapping("/subscribe")
    public void subscribeRooms(@Payload User user) {

    }


//    @MessageMapping("/chat")
//    public void sendMessage(@Payload ChatMessageDTO chatMessage) {
//
//        messagingTemplate.convertAndSendToUser(
//                chatMessage.getReceiver().getEmail(),
//                "/topic/messages",
//                chatMessage
//        );
//    }


}
