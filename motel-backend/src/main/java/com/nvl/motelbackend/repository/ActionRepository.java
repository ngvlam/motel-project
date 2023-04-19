package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Action;
import com.nvl.motelbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActionRepository extends JpaRepository<Action, Long> {

    Page<Action> findAllByUser(User user, Pageable pageable);
}
