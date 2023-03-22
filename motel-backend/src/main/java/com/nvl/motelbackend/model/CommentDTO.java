package com.nvl.motelbackend.model;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Data
public class CommentDTO {

    private Long id;

    private String content;

    private Date updatedAt;

    private Date createdAt;

    private long rate;

    private Long postId;

    private UserDTO userDTO;

}
