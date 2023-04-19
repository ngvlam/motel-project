package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.entity.Image;
import com.nvl.motelbackend.model.ImageDTO;
import com.nvl.motelbackend.service.impl.ImageServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ImageController {

    @Autowired
    private ImageServiceImpl imageService;

    @PostMapping("/uploadImage/post/{postId}")
    public ImageDTO uploadFile(@PathVariable Long postId, @RequestParam("file") MultipartFile file) {
        return imageService.uploadFile(postId, file);
    }

    @DeleteMapping("/deleteImage/post/{postId}")
    public void deleteFile(@PathVariable Long postId) {
        imageService.deleteAllImage(postId);
    }

    @PostMapping("/uploadMultipleFiles/post/{postId}")
    public List<ImageDTO> uploadMultipleFiles(@PathVariable Long postId, @RequestParam("files") MultipartFile[] files) {
        return Arrays.asList(files)
                .stream()
                .map(file -> uploadFile(postId, file))
                .collect(Collectors.toList());
    }

    @GetMapping("/imageByte/post/{postId}")
    public List<ImageDTO> getImageDTOByIdPost(@PathVariable Long postId) {
        return imageService.getImageDTOByPostId(postId);
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String id) {
        // Load file from database
        Image image = imageService.getImage(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getFileType()))
//                .header("attachment; filename=\"" + image.getFileName() + "\"")
                .body(new ByteArrayResource(image.getData()));
    }
}
