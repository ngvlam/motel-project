package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.entity.Comment;
import com.nvl.motelbackend.model.CommentDTO;
import com.nvl.motelbackend.repository.CommentRepository;
import com.nvl.motelbackend.repository.PostRepository;
import com.nvl.motelbackend.service.CommentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    CommentRepository commentRepository;
    @Autowired
    PostRepository postRepository;

    ModelMapper mapper = new ModelMapper();


    @Override
    public Page<CommentDTO> getCommentByPostId(Long postId, int page) {
        Page<Comment> commentPage = commentRepository.findByPostId(postId, PageRequest.of(page, 10, Sort.by("updatedAt").descending()));

        Page<CommentDTO> commentDTOPage = commentPage.map(comment -> {
            CommentDTO commentDTO = mapToDTO(comment);
            return commentDTO;
        });
        return commentDTOPage;
    }

    @Override
    public CommentDTO createComment(CommentDTO commentDTO, String email) {
        return null;
    }

    @Override
    public CommentDTO updateComment(Long id, CommentDTO commentDTO, String email) {
        return null;
    }

    @Override
    public void deleteComment(Long id) {

    }

    private CommentDTO mapToDTO(Comment comment) {
        CommentDTO commentDTO = mapper.map(comment, CommentDTO.class);
        return commentDTO;
    }

    private Comment mapToEntity(CommentDTO commentDTO) {
        Comment comment = mapper.map(commentDTO, Comment.class);
        return comment;
    }
}
