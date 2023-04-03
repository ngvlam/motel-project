package com.nvl.motelbackend.model;

import com.nvl.motelbackend.entity.ToiletName;
import lombok.Data;

@Data
public class AccomodationDTO {
    private Long id;
    private ToiletName toilet;
    private PostDTO post;

}
