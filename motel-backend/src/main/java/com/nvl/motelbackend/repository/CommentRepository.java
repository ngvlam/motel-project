package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Comment;
import com.nvl.motelbackend.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByPostId(long postId, Pageable pageable);
}
