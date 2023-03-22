package com.nvl.motelbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
public class PostDTO {
    private Long id;

    @NotEmpty
    @Size(min = 2, message = "Tiêu đề tin phải chứa 2 kí tự trở lên")
    private String title;

    private String content;

    private boolean isApproved;

    private boolean del;

    private Date createdAt;

    private Date updatedAt;

    private Set<CommentDTO> comments;

    private Set<String> imageStrings;
}
