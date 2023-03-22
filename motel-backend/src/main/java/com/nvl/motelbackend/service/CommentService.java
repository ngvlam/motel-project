package com.nvl.motelbackend.service;

import com.nvl.motelbackend.model.CommentDTO;
import org.springframework.data.domain.Page;

public interface CommentService {
    Page<CommentDTO> getCommentByPostId(Long idPost, int page);

    CommentDTO createComment(CommentDTO commentDTO, String email);

    CommentDTO updateComment(Long id, CommentDTO commentDTO, String email);

    void deleteComment(Long id);
}
