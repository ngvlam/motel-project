package com.nvl.motelbackend.utils;

import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.exception.MotelAPIException;
import com.nvl.motelbackend.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

public class PostUtils {
    public static void checkPostUpdateAuthorization(Post post, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

//        if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
//            // Prevent an admin from hiding other admin's posts
//            if (post.getUser().getRoles().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))
//                    && !post.getUser().getId().equals(userDetails.getId())) {
//                throw new MotelAPIException(HttpStatus.FORBIDDEN, "Admin is not authorized to hide another admin's post");
//            }
//        } else {
//            // Only allow the owner or an admin to unhide a post
//            Long userId = userDetails.getId();
//            if (!post.getUser().getId().equals(userId) && !authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
//                throw new MotelAPIException(HttpStatus.FORBIDDEN, "User is not authorized to update post visibility");
//            }
//        }
        Long userId = userDetails.getId();
            if (!post.getUser().getId().equals(userId)) {
                throw new MotelAPIException(HttpStatus.FORBIDDEN, "User is not authorized to update post visibility");
            }
    }
}

