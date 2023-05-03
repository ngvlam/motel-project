package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.FavoritePost;
import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.time.LocalDateTime;

public interface FavoritePostRepository extends JpaRepository<FavoritePost, Long> {


    @Query("SELECT fp.post FROM FavoritePost fp WHERE fp.user = :user")
    Page<Post> findFavoritePostsByUser(@Param("user") User user, Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO favorite_posts (user_id, post_id, added_timestamp) VALUES (:userId, :postId, :timestamp)", nativeQuery = true)
    void addFavoritePost(@Param("userId") Long userId, @Param("postId") Long postId, @Param("timestamp") LocalDateTime timestamp);

    void removeFavoritePostByUserAndPost(User user, Post post);
}
