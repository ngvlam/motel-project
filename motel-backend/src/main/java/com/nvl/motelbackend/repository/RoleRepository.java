package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Role;
import com.nvl.motelbackend.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(RoleName roleName);
}
