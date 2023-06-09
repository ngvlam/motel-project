package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.ChatMessage;
import com.nvl.motelbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT cm.receiver from ChatMessage cm where cm.sender = :sender")
    Set<User> findReceiverBySender(@Param("sender") User sender);
    List<ChatMessage> findBySenderAndReceiverOrderBySentAt(User sender, User receiver);
}
