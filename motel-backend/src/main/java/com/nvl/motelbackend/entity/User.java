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
@Table(name = "user", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"email"})
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "password", nullable = false)
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

    @ManyToMany(fetch = FetchType.EAGER,
            cascade = {
                CascadeType.PERSIST, CascadeType.MERGE
            })
    @JoinTable(name = "user_roles",
                joinColumns = @JoinColumn(name = "user_id"),
                inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
}