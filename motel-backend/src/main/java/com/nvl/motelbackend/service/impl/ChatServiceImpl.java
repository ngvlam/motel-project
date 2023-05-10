package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.entity.ChatMessage;
import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.exception.ResourceNotFoundException;
import com.nvl.motelbackend.model.ChatMessageDTO;
import com.nvl.motelbackend.model.PostDTO;
import com.nvl.motelbackend.model.UserDTO;
import com.nvl.motelbackend.repository.ChatMessageRepository;
import com.nvl.motelbackend.repository.UserRepository;
import com.nvl.motelbackend.service.ChatService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;

    public ChatServiceImpl(UserRepository userRepository, ChatMessageRepository chatMessageRepository) {
        this.userRepository = userRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    ModelMapper mapper = new ModelMapper();


    @Override
    public Set<UserDTO> getAllReceiverBySender(Long senderId) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new ResourceNotFoundException("Sender", "id", senderId));
        Set<UserDTO> users = chatMessageRepository.findReceiverBySender(sender).stream().map(this::mapUserToUserDTO).collect(Collectors.toSet());
        return users;
    }

    @Override
    public List<ChatMessageDTO> getMessages(Long senderId, Long receiverId) {

        User sender = userRepository.findById(senderId).orElseThrow(() -> new ResourceNotFoundException("Sender", "id", senderId));
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new ResourceNotFoundException("Receiver", "id", receiverId));
        List<ChatMessageDTO> chatMessageDTOS = chatMessageRepository.findBySenderAndReceiverOrderBySentAt(sender, receiver).stream().map(this::mapToDTO).collect(Collectors.toList());
        return chatMessageDTOS;
    }

    @Override
    public void saveMessages(ChatMessageDTO chatMessageDTO) {
        chatMessageDTO.setSentAt(LocalDateTime.now());
        ChatMessage chatMessage = mapper.map(chatMessageDTO, ChatMessage.class);
        chatMessageRepository.save(chatMessage);
    }

    private ChatMessageDTO mapToDTO(ChatMessage chatMessage) {
        return mapper.map(chatMessage, ChatMessageDTO.class);
    }

    private UserDTO mapUserToUserDTO(User user) {
        return mapper.map(user, UserDTO.class);
    }
}
