package com.nvl.motelbackend.model;

import com.nvl.motelbackend.entity.AccommodationCategory;
import com.nvl.motelbackend.entity.ToiletName;
import lombok.Data;

import javax.persistence.Column;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
public class AccommodationDTO {
    private Long id;

    @NotNull(message = "Diện tích không được bỏ trống")
    @NotEmpty
    private double acreage;

    @NotBlank(message = "Địa chỉ không được bỏ trống")
    @NotNull
    private String address;

    private ToiletName toilet;

    private boolean internet;

    private boolean parking;

    private boolean airConditioner;

    private boolean heater;

    private boolean tv;

    @NotNull(message = "Giá không được bỏ trống")
    @NotEmpty
    @Pattern(regexp = "^[0-9]+$", message = "Giá không đúng định dạng")
    private double price;

    private boolean status;

    private double xCoordinate;

    private double yCoordinate;

    private Long postId;

    private Integer categoryId;
}
