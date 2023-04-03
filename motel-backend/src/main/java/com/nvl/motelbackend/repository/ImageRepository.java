package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Image;
import com.nvl.motelbackend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, String> {
    List<Image> findImageByPost(Post post);
}