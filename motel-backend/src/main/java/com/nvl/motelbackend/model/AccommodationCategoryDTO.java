package com.nvl.motelbackend.model;

import com.nvl.motelbackend.entity.AccommodationName;
import lombok.Data;

import java.util.Set;

@Data
public class AccommodationCategoryDTO {
    private Integer id;
    private AccommodationName name;
    private Set<AccommodationDTO> accommodations;
}
