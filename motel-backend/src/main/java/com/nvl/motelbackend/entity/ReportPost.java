package com.nvl.motelbackend.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor


@Entity
@Table(name = "report_post")
public class ReportPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean scam;
    private boolean duplicate;

    @Column(name = "cannot_contact")
    private boolean cannotContact;

    @Column(name = "wrong_photo")
    private boolean wrongPhoto;

    @Column(name = "wrong_info")
    private boolean wrongInfo;

    @Column(name = "rented_out")
    private boolean rentedOut;

    private String another;

    private LocalDateTime timeReport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

}
