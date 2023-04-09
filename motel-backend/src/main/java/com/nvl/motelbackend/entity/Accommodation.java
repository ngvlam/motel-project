package com.nvl.motelbackend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "accommodation")
public class Accommodation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double acreage;

    private String address;

//    @Column(name = "electric_price")
//    private double electricPrice;
//
//    @Column(name = "water_price")
//    private double waterPrice;

    private boolean internet;

    private boolean parking;

    @Column(name = "air_conditioner")
    private boolean airConditioner;

    private boolean heater;

    private boolean tv;

    private double price;

    private boolean status;

    @Column(name = "x_coordinate")
    private double xCoordinate;

    @Column(name = "y_coordinate")
    private double yCoordinate;

    @Enumerated(EnumType.STRING)
    @Column(length = 60)
    private ToiletName toilet;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private AccommodationCategory category;
}
