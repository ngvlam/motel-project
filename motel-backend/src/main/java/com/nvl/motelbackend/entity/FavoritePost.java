package com.nvl.motelbackend.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorite_posts")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FavoritePost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @Column(name = "added_timestamp")
    private LocalDateTime addedTimestamp;

    // constructors, getters, and setters

}
