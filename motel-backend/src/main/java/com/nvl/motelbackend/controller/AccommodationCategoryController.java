package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.model.AccommodationCategoryDTO;
import com.nvl.motelbackend.service.AccommodationCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AccommodationCategoryController {

    @Autowired
    AccommodationCategoryService accommodationCategoryService;

    @GetMapping("/accommodationCategory/{id}")
    public ResponseEntity<AccommodationCategoryDTO> getAccommodationCategoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(accommodationCategoryService.getAccommodationCategoryById(id));
    }
}
