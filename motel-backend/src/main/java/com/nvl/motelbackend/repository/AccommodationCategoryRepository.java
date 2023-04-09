package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.AccommodationCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccommodationCategoryRepository extends JpaRepository<AccommodationCategory, Integer> {
    Optional<AccommodationCategory> findById(Integer id);
}
