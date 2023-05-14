package com.nvl.motelbackend.model;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor

@ApiModel(description = "Post model information")
public class PostDTO {
    @ApiModelProperty(value = "Mã tin đăng")
    private Long id;

    @ApiModelProperty(value = "Tiêu đề tin đăng")
    @NotEmpty
    @Size(min = 10, message = "Tiêu đề phải chứa từ 10 kí tự trở lên")
    @Size(max = 100, message = "Tiêu đề chỉ chứa tối đa 100 ký tự")
    private String title;

    @ApiModelProperty(value = "Mô tả chi tiết tin đăng")
    @NotEmpty
    @Size(min = 10, message = "Nội dung phải chứa từ 10 kí tự trở lên")
    @Size(max = 1000, message = "Nội dung chỉ chứa tối đa 1000 ký tự")
    private String content;

    @ApiModelProperty(value = "Kiểm tra trạng thái đã duyệt")
    private boolean approved;

    @ApiModelProperty(value = "Kiểm tra trạng thái bị từ chối")
    private boolean notApproved;

    @ApiModelProperty(value = "Kiểm tra trạng thái đã ẩn")
    private boolean del;

    @Min(value = 0, message = "Giá trị của trường priority phải lớn hơn hoặc bằng 0")
    @Max(value = 1, message = "Giá trị của trường priority phải nhỏ hơn hoặc bằng 1")
    @ApiModelProperty(value = "Độ ưu tiên")
    private int priority;

    @Min(value = 3, message = "Số ngày đăng tin phải lớn hơn 3")
    @ApiModelProperty(value = "Số ngày đăng tin")
    private int numberOfDays;

    @ApiModelProperty(value = "Thời gian tạo")
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "Thời gian cập nhật")
    private LocalDateTime updatedAt;

    @ApiModelProperty(value = "Người đăng")
    private UserDTO user;

    @ApiModelProperty(value = "Thông tin tiện ích")
    private AccommodationDTO accommodation;

    @ApiModelProperty(value = "Danh sách bình luận")
    private Set<CommentDTO> comments;

    @ApiModelProperty(value = "Danh sách ảnh")
    private List<String> imageStrings;
}
