package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.exception.ResourceNotFoundException;
import com.nvl.motelbackend.model.PostDTO;
import com.nvl.motelbackend.repository.PostRepository;
import com.nvl.motelbackend.service.PostService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ModelMapper mapper;

    @Override
    public Page<PostDTO> getAllPost(Pageable page) {
        Page<PostDTO> posts = postRepository.findAll(page)
                .map(this::mapToDTO);

        return posts;
    }

    @Override
    public PostDTO createPost(PostDTO postDTO) {

        // convert DTO to entity
        Post post = mapToEntity(postDTO);
        post.setDel(false);
        post.setApproved(false);
        Post newPost = postRepository.save(post);

        //convert entity to DTO
        PostDTO postResponse = mapToDTO(newPost);
        return postResponse;
    }

    @Override
    public PostDTO getPostById(long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        return mapToDTO(post);
    }

    @Override
    public PostDTO updatePost(PostDTO postDto, long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());

        Post updatedPost = postRepository.save(post);
        return mapToDTO(updatedPost);
    }

    @Override
    public void deletePostById(long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        postRepository.delete(post);
    }


    private PostDTO mapToDTO(Post post) {
        PostDTO postDTO = mapper.map(post, PostDTO.class);
        return postDTO;
    }

    private Post mapToEntity(PostDTO postDTO) {
        Post post = mapper.map(postDTO, Post.class);
        return post;
    }
}
