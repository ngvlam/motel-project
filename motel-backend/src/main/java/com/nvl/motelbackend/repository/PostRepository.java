package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByUser(User user, Pageable pageable);

    Page<Post> findAllByOrderByPriorityDesc(Pageable pageable);

    @Query("SELECT p from Post p where p.accommodation.category.id = ?1")
    Page<Post> findAllByCategory(Integer categoryId, Pageable pageable);
    Optional<Post> findPostById(Long id);
    Page<Post> findAllByApprovedAndNotApprovedAndDel(boolean approved, boolean notApproved, boolean del, Pageable pageable);
    Page<Post> findAllByApprovedAndNotApproved(boolean approved, boolean notApproved, Pageable pageable);

    Page<Post> findAllByApprovedAndDel(boolean approved, boolean del, Pageable pageable);
    Page<Post> findAllByApproved(boolean approved, Pageable pageable);
}
