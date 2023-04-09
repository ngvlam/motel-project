package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.entity.AccommodationCategory;
import com.nvl.motelbackend.exception.ResourceNotFoundException;
import com.nvl.motelbackend.model.AccommodationCategoryDTO;
import com.nvl.motelbackend.repository.AccommodationCategoryRepository;
import com.nvl.motelbackend.service.AccommodationCategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class AccommodationCategoryServiceImpl implements AccommodationCategoryService {

    private final AccommodationCategoryRepository accommodationCategoryRepository;
    private ModelMapper mapper;

    public AccommodationCategoryServiceImpl(AccommodationCategoryRepository accommodationCategoryRepository, ModelMapper mapper) {
        this.accommodationCategoryRepository = accommodationCategoryRepository;
        this.mapper = mapper;
    }


    @Override
    public AccommodationCategoryDTO getAccommodationCategoryById(Integer id) {
        AccommodationCategory accommodationCategory = accommodationCategoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return mapper.map(accommodationCategory, AccommodationCategoryDTO.class);
    }
}
