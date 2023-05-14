package com.nvl.motelbackend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private boolean approved;

    @Column(name = "not_approved", nullable = false)
    private boolean notApproved;

    private boolean del;

    @Column(nullable = false)
    private int priority;

//    private String package
//
    @Column(name = "number_of_days", nullable = false)
    private int numberOfDays;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(cascade = CascadeType.ALL,
            mappedBy = "post",
            orphanRemoval = true)
    private Set<Image> images = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL,
            mappedBy = "post",
            orphanRemoval = true)
    private Set<Comment> comments = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL,
            mappedBy = "post",
            fetch = FetchType.LAZY,
            optional = false)
    private Accommodation accommodation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(cascade = CascadeType.ALL,
            mappedBy = "post",
            orphanRemoval = true)
    private List<Action> actions = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "post")
    private List<ReportPost> reportPosts = new ArrayList<>();
}
