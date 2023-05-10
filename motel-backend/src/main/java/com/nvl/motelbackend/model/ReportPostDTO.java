package com.nvl.motelbackend.model;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReportPostDTO {
    private Long id;

    private boolean scam;
    private boolean duplicate;

    private boolean cannotContact;

    private boolean wrongPhoto;

    private boolean wrongInfo;

    private boolean rentedOut;

    private String another;

    private LocalDateTime timeReport;

    private Long postId;

}
