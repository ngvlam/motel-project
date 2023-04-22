package com.nvl.motelbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {
    private Long id;

    @NotEmpty
    @Size(min = 10, message = "Tiêu đề phải chứa từ 10 kí tự trở lên")
    @Size(max = 100, message = "Tiêu đề chỉ chứa tối đa 100 ký tự")
    private String title;

    @NotEmpty
    @Size(min = 10, message = "Nội dung phải chứa từ 10 kí tự trở lên")
    @Size(max = 1000, message = "Nội dung chỉ chứa tối đa 1000 ký tự")
    private String content;

    private boolean approved;
    private boolean notApproved;

    private boolean del;

    private int priority;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private UserDTO user;

    private AccommodationDTO accommodation;
    
    private Set<CommentDTO> comments;

    private List<String> imageStrings;
}
