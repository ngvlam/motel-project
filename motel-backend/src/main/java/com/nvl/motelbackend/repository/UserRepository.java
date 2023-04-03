package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Role;
import com.nvl.motelbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Page<User> findAll(Pageable page);
    Page<User> findAllByRolesIn(Pageable page, List<Role> roles);

}
