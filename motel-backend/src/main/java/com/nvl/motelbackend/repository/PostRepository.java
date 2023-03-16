package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

}
