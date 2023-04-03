package com.nvl.motelbackend.service;

import com.nvl.motelbackend.entity.Image;
import com.nvl.motelbackend.model.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
    ImageDTO uploadFile(Long postId, MultipartFile file);

    Image storeImage(Long postId, MultipartFile file);

    Image getImage(String id);
    List<String> getImageByPostId(Long postId);

    void deleteAllImage(Long postId);

    List<ImageDTO> getImageDTOByPostId(Long postId);
}
