package com.nvl.motelbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SearchDTO {
    private Double minAcreage;

    private Double maxAcreage;

    private Double minPrice;

    private Double maxPrice;

    private Integer categoryId;

    private String address;

    private Double xCoordinate;

    private Double yCoordinate;

    private Double radius;

    public SearchDTO() {
    }
}
