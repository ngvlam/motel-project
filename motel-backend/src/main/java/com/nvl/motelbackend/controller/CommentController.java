package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.model.CommentDTO;
import com.nvl.motelbackend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api")
public class CommentController {
    @Autowired
    CommentService commentService;

    @GetMapping("/posts/{postId}/comments")
    public Page<CommentDTO> getCommentByPostId(@PathVariable(value = "postId") Long postId, @RequestParam("page") int page) {
        return commentService.getCommentByPostId(postId, page);
    }
}
