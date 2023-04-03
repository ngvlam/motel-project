package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Accomodation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccomodationRepository extends JpaRepository<Accomodation, Long> {
}
