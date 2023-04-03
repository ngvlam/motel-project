package com.nvl.motelbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImageDTO {
    private String id;

    private String fileName;

    private String fileType;

    private String uri;

    private Long postId;

}
