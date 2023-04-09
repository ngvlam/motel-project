package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Accommodation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
}
