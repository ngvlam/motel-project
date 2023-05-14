package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.interceptor.RateLimit;
import com.nvl.motelbackend.model.PostDTO;
import com.nvl.motelbackend.model.SearchDTO;
import com.nvl.motelbackend.service.PostService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Api(value = "Rest API bài đăng")
@RestController
@RequestMapping("/api")
public class PostController {
    @Autowired
    private PostService postService;

    @ApiOperation(value = "Lấy tất cả tin đăng")
    @GetMapping("/posts")
    public Page<PostDTO> getAllPost(@PageableDefault(page = 0, size = 12) Pageable page) {
        return postService.getAllPost(page);
    }

    @ApiOperation("Lấy tất cả các tin đăng theo chuyên mục")
    @GetMapping("/posts/category/{categoryId}")
    public Page<PostDTO> getAllPostByCategory(@PathVariable Integer categoryId, @PageableDefault(page = 0, size = 12) Pageable page) {
        return postService.getAllPostByCategory(categoryId, page);
    }

    @ApiOperation("Lấy tin đăng theo mã tin")
    @GetMapping("/posts/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable(name = "id") long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @ApiOperation("Lấy tất cả các tin đăng đã duyệt")
    @GetMapping("/posts/approved/true")
    public Page<PostDTO> getAllPostApproved (@PageableDefault(page = 0, size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable page) {
        return postService.getAllPostByApproved(true, page);
    }

    @ApiOperation("Lấy tất cả các tin đăng chờ duyệt")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @GetMapping("/posts/waiting")
    public Page<PostDTO> getPostWaitingApprove(@PageableDefault(page = 0, size = 10, sort = "updatedAt", direction = Sort.Direction.ASC) Pageable page) {
        return postService.getPostWaitingApprove(page);
    }

    @ApiOperation("Lấy tất cả tin đăng bị từ chối")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @GetMapping("/posts/approved/false")
    public Page<PostDTO> getAllPostNotApproved (@PageableDefault(page = 0, size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable page) {
        return postService.getAllPostByApproved(false, page);
    }

    @ApiOperation("Lấy tất cả tin đăng của một người dùng")
    @GetMapping("/posts/user/{userId}")
    public Page<PostDTO> getPostByUserId(@PathVariable long userId, @RequestParam int page) {
        return postService.getPostByUserId(userId, page);
    }

    @ApiOperation("Tìm kiếm tin đăng")
    @GetMapping("/posts/search")
    public Page<PostDTO> searchPost(SearchDTO searchRequest, @PageableDefault(page = 0, size = 10) Pageable page){
//        searchForm.setPriceStart(searchForm.getPriceStart()*1000000);
//        searchForm.setPriceEnd(searchForm.getPriceEnd()*1000000);
        return postService.searchPost(searchRequest, page);
    }

    @RateLimit
    @ApiOperation("Đăng tin mới")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MODERATOR')")
    @PostMapping("/posts")
    public ResponseEntity<PostDTO> createPost(@Valid @RequestBody PostDTO postDTO, Authentication authentication) {
        return new ResponseEntity<>(postService.createPost(postDTO, authentication.getName()), HttpStatus.CREATED);
    }

    @ApiOperation("Chỉnh sửa tin đăng")
    @PutMapping("/posts/{id}")
    public ResponseEntity<PostDTO> updatePost(@Valid @RequestBody PostDTO postDTO, @PathVariable(name = "id") Long id, Authentication authentication) {
        PostDTO postResponse = postService.updatePost(postDTO, id, authentication);
        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    @ApiOperation("Duyệt/Từ chối tin đăng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @PutMapping("/posts/{id}/approve/{bool}")
    public PostDTO approvePost(@PathVariable Long id, @PathVariable boolean bool, Authentication authentication) {
        return postService.approvePost(id, authentication.getName(), bool);
    }

    @ApiOperation("Ẩn một tin đăng")
    @PutMapping("/posts/hide/{id}")
    public ResponseEntity<PostDTO> hidePost(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(postService.hidePost(id, authentication));
    }

    @ApiOperation("Xóa một tin đăng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<String> deletePost(@PathVariable(name = "id") long id) {
        postService.deletePostById(id);
        return new ResponseEntity<>("Đã xóa tin đăng thành công", HttpStatus.OK);
    }

}
