package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.entity.Image;
import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.exception.MotelAPIException;
import com.nvl.motelbackend.exception.ResourceNotFoundException;
import com.nvl.motelbackend.model.ImageDTO;
import com.nvl.motelbackend.repository.ImageRepository;
import com.nvl.motelbackend.repository.PostRepository;
import com.nvl.motelbackend.service.ImageService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    ImageRepository imageRepository;

    @Autowired
    PostRepository postRepository;

    ModelMapper mapper = new ModelMapper();

    @Override
    public ImageDTO uploadFile(Long postId, MultipartFile file) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        Image image = storeImage(postId, file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("api/image")
                .path(image.getId())
                .toUriString();
        return new ImageDTO(image.getId(), image.getFileName(), file.getContentType(), fileDownloadUri, postId);

    }

    @Override
    public Image storeImage(Long postId, MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
       try {
           if (fileName.contains("..")) {
               throw new MotelAPIException(HttpStatus.BAD_REQUEST, "Tệp có đường dẫn không hợp lệ" + fileName);
           }
           Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
           Image image = new Image();
           image.setFileName(fileName);
           image.setFileType(file.getContentType());
           image.setData(file.getBytes());
           image.setPost(post);
           return imageRepository.save(image);
       } catch (IOException ex) {
           throw new MotelAPIException(HttpStatus.FORBIDDEN, "Xảy ra lỗi trong quá trình lưu ảnh: " + fileName + ".!" + ex);
       }
    }

    @Override
    public Image getImage(String id) {
        return imageRepository.findById(id).orElseThrow(()-> new MotelAPIException(HttpStatus.NOT_FOUND, "Không tìm thấy ảnh có id " + id));
    }

    @Override
    public List<String> getImageByPostId(Long postId) {
        List<String> uri = new ArrayList<>();
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        List<Image> images = imageRepository.findImageByPost(post);
        for (Image image : images)
            uri.add(ServletUriComponentsBuilder.fromCurrentContextPath()
                            .path("/api/image/")
                            .path(image.getId())
                            .toUriString()
                    );
        return uri;
    }

    @Override
    public void deleteAllImage(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        List<Image> images = imageRepository.findImageByPost(post);
        for (Image image : images) {
            imageRepository.delete(image);
        }
    }

    @Override
    public List<ImageDTO> getImageDTOByPostId(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        List<Image> images = imageRepository.findImageByPost(post);
        List<ImageDTO> imageDTOS = new ArrayList<>();
        for (Image image : images) {
            ImageDTO imageDTO = mapper.map(image, ImageDTO.class);
            imageDTO.setUri(Base64.getEncoder().encodeToString(image.getData()));
            imageDTOS.add(imageDTO);
        }
        return imageDTOS;
    }
}
