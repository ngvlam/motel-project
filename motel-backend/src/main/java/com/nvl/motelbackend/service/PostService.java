package com.nvl.motelbackend.service;

import com.nvl.motelbackend.model.PostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {
    Page<PostDTO> getAllPost(Pageable page);

    Page<PostDTO> getAllPostByApproved(boolean approved, Pageable page);
    PostDTO createPost(PostDTO postDTO);

    Page<PostDTO> getPostByUserId(Long userId, int page);

    Page<PostDTO> getPostByUserEmail(String email, Pageable page);

    PostDTO getPostById(Long id);

    PostDTO updatePost(PostDTO postDto, long id);

    PostDTO hidePost(Long id);

    void deletePostById(Long id);

    PostDTO approvePost(Long id, String usernameApproved, boolean isApprove);
}
