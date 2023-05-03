package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.Role;
import com.nvl.motelbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Page<User> findAll(Pageable page);
    @Query("SELECT u.favoritePosts FROM User u WHERE u.id = :userId")
    Page<Post> findFavoritePostsByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT u FROM User u join u.roles r WHERE u.fullName LIKE %:query% OR u.email LIKE %:query% and r in :roles")

    Page<User> searchUser(@Param("query") String query, @Param("roles") List<Role> roles, Pageable page);
    Page<User> findAllByRolesIn(Pageable page, List<Role> roles);

    boolean existsByEmail(String email);
}
