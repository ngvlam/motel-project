package com.nvl.motelbackend.service;

import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.model.PostDTO;
import com.nvl.motelbackend.model.SearchDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {
    Page<PostDTO> getAllPost(Pageable page);

    Page<PostDTO> getAllPostByCategory(Integer categoryId, Pageable pageable);

    Page<PostDTO> getAllPostByApproved(boolean approved, Pageable page);

    Page<PostDTO> getPostWaitingApprove(Pageable page);
    PostDTO createPost(PostDTO postDTO, String name);

    Page<PostDTO> getPostByUserId(Long userId, int page);

    Page<PostDTO> getPostByUserEmail(String email, Pageable page);

    PostDTO getPostById(Long id);

    Page<PostDTO> searchPost(SearchDTO searchRequest, Pageable page);

    PostDTO updatePost(PostDTO postDto, long id);

    PostDTO hidePost(Long id);

    void deletePostById(Long id);

    PostDTO approvePost(Long id, String usernameApproved, boolean isApprove);

}
