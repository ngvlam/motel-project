package com.nvl.motelbackend.service;

import com.nvl.motelbackend.model.PostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {
    Page<PostDTO> getAllPost(Pageable page);
    PostDTO createPost(PostDTO postDTO);

    PostDTO getPostById(long id);

    PostDTO updatePost(PostDTO postDto, long id);

    void deletePostById(long id);
}
