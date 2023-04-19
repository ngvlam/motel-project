package com.nvl.motelbackend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.nvl.motelbackend.entity.ActionName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ActionDTO {
    private Long id;

    private String username;

    private ActionName action;

    private String postTitle;

    private Long postId;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER)
    private LocalDateTime time;
}
