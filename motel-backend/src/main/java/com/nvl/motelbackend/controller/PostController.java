package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.model.PostDTO;
import com.nvl.motelbackend.model.SearchDTO;
import com.nvl.motelbackend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class PostController {
    @Autowired
    private PostService postService;

    @GetMapping("/posts")
    public Page<PostDTO> getAllPost(@PageableDefault(page = 0, size = 12) Pageable page) {
        return postService.getAllPost(page);
    }

    @GetMapping("/posts/category/{categoryId}")
    public Page<PostDTO> getAllPostByCategory(@PathVariable Integer categoryId, @PageableDefault(page = 0, size = 12) Pageable page) {
        return postService.getAllPostByCategory(categoryId, page);
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable(name = "id") long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/posts/approved/true")
    public Page<PostDTO> getAllPostApproved (@PageableDefault(page = 0, size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable page) {
        return postService.getAllPostByApproved(true, page);
    }

    @GetMapping("/posts/waiting")
    public Page<PostDTO> getPostWaitingApprove(@PageableDefault(page = 0, size = 10, sort = "updatedAt", direction = Sort.Direction.ASC) Pageable page) {
        return postService.getPostWaitingApprove(page);
    }

    @GetMapping("/posts/approved/false")
    public Page<PostDTO> getAllPostNotApproved (@PageableDefault(page = 0, size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable page) {
        return postService.getAllPostByApproved(false, page);
    }

    @GetMapping("/posts/user/{userId}")
    public Page<PostDTO> getPostByUserId(@PathVariable long userId, @RequestParam int page) {
        return postService.getPostByUserId(userId, page);
    }

    @GetMapping("/posts/search")
    public Page<PostDTO> searchPost(SearchDTO searchRequest, @PageableDefault(page = 0, size = 10) Pageable page){
//        searchForm.setPriceStart(searchForm.getPriceStart()*1000000);
//        searchForm.setPriceEnd(searchForm.getPriceEnd()*1000000);
        return postService.searchPost(searchRequest, page);
    }

    @PostMapping("/posts")
    public ResponseEntity<PostDTO> createPost(@Valid @RequestBody PostDTO postDTO, @RequestParam String auth) {
        return new ResponseEntity<>(postService.createPost(postDTO, auth), HttpStatus.CREATED);
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<PostDTO> updatePost(@Valid @RequestBody PostDTO postDTO, @PathVariable(name = "id") long id) {
        PostDTO postResponse = postService.updatePost(postDTO, id);
        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    @PutMapping("/posts/{id}/approve/{bool}")
    public PostDTO approvePost(@PathVariable Long id, @PathVariable boolean bool, @RequestParam String auth) {
        return postService.approvePost(id, auth, bool);
    }

    @PutMapping("/posts/hide/{id}")
    public ResponseEntity<PostDTO> hidePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.hidePost(id));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<String> deletePost(@PathVariable(name = "id") long id) {
        postService.deletePostById(id);
        return new ResponseEntity<>("Đã xóa tin đăng thành công", HttpStatus.OK);
    }
}
