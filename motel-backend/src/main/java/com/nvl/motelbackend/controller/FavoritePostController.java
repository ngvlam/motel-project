package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.model.PostDTO;
import com.nvl.motelbackend.security.CustomUserDetails;
import com.nvl.motelbackend.service.FavoritePostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class FavoritePostController {

//    @PostMapping("/favorites/{postId}")
//    public ResponseEntity<?> addFavorite(@PathVariable Long postId, Authentication authentication) {
//        // implementation goes here
//    }
    private final FavoritePostService favoritePostService;

    public FavoritePostController(FavoritePostService favoritePostService) {
        this.favoritePostService = favoritePostService;
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MODERATOR')")
    @GetMapping("/favorite-posts")
    public ResponseEntity<Page<PostDTO>> getFavoritePosts(@PageableDefault(page = 0, size = 5, sort = "addedTimestamp", direction = Sort.Direction.DESC) Pageable page, Authentication authentication) {
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(favoritePostService.getFavoritePostsByUser(page, user.getId()));
    }

    @PostMapping("/favorite-posts/{postId}")
    public ResponseEntity<?> addFavoritePost(@PathVariable Long postId, Authentication authentication) {
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        favoritePostService.addToFavoritePost(user.getId(), postId);

        return ResponseEntity.ok("Add to favorite successfully");
    }
}
