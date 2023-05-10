package com.nvl.motelbackend.service;

import com.nvl.motelbackend.entity.ChatMessage;
import com.nvl.motelbackend.model.ChatMessageDTO;
import com.nvl.motelbackend.model.UserDTO;

import java.util.List;
import java.util.Set;

public interface ChatService {

    Set<UserDTO> getAllReceiverBySender(Long senderId);
    List<ChatMessageDTO> getMessages(Long senderId, Long receiverId);
    void saveMessages(ChatMessageDTO chatMessageDTO);
}
