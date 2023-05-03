package com.nvl.motelbackend.service;

import com.nvl.motelbackend.model.PostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FavoritePostService {
    Page<PostDTO> getFavoritePostsByUser(Pageable page, Long userId);
    void addToFavoritePost(Long userId, Long postId);

    void removeFavoritePost(Long userId, Long postId);
}
