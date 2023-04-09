package com.nvl.motelbackend.model;

import com.nvl.motelbackend.entity.AccommodationCategory;
import com.nvl.motelbackend.entity.ToiletName;
import lombok.Data;

import javax.persistence.Column;

@Data
public class AccommodationDTO {
    private Long id;
    private double acreage;
    private String address;
    private ToiletName toilet;
    private boolean internet;

    private boolean parking;

    private boolean airConditioner;

    private boolean heater;

    private boolean tv;

    private double price;

    private boolean status;

    private double xCoordinate;

    private double yCoordinate;

    private Long postId;

    private String category;
}
