package com.nvl.motelbackend.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data

@Entity
@Table(name = "accommodation_category")
public class AccommodationCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private AccommodationName name;

    @OneToMany(cascade = CascadeType.ALL,
                mappedBy = "category",
                orphanRemoval = true)
    private Set<Accommodation> accommodations = new HashSet<>();
}
