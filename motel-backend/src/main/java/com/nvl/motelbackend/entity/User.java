package com.nvl.motelbackend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String email;

    @Column(name = "full_name")
    private String fullName;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;

    private String address;

    private String phone;

    private boolean block;

    @Lob
    private String b64;

    @Column(name = "file_type")
    private String fileType;

    @OneToMany(cascade = CascadeType.ALL,
            mappedBy = "user",
            orphanRemoval = true)
    private Set<Post> posts = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL,
            mappedBy = "user",
            orphanRemoval = true)
    private Set<Post> comments = new HashSet<>();

}