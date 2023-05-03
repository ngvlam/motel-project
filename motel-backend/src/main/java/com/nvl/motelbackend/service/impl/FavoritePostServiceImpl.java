package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.entity.FavoritePost;
import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.exception.MotelAPIException;
import com.nvl.motelbackend.exception.NoFavoritePostsException;
import com.nvl.motelbackend.exception.ResourceNotFoundException;
import com.nvl.motelbackend.model.PostDTO;
import com.nvl.motelbackend.repository.FavoritePostRepository;
import com.nvl.motelbackend.repository.PostRepository;
import com.nvl.motelbackend.repository.UserRepository;
import com.nvl.motelbackend.service.FavoritePostService;
import com.nvl.motelbackend.service.ImageService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class FavoritePostServiceImpl implements FavoritePostService {
    private final UserRepository userRepository;
    private final FavoritePostRepository favoritePostRepository;
    private final PostRepository postRepository;
    private final ImageService imageService;

    ModelMapper mapper = new ModelMapper();

    public FavoritePostServiceImpl(UserRepository userRepository, FavoritePostRepository favoritePostRepository, PostRepository postRepository, ImageService imageService) {
        this.userRepository = userRepository;
        this.favoritePostRepository = favoritePostRepository;
        this.postRepository = postRepository;
        this.imageService = imageService;
    }

    @Override
    public Page<PostDTO> getFavoritePostsByUser(Pageable page, Long userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Page<PostDTO> favoritePosts = favoritePostRepository.findFavoritePostsByUser(user, page)
                .map(this::mapToPostDTO);

        if (favoritePosts.isEmpty()) {
            throw new NoFavoritePostsException("User has no favorite posts");
        }

        return favoritePosts;
    }

    public void addToFavoritePost(Long userId, Long postId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        Set<FavoritePost> favoritePosts = user.getFavoritePosts();
        if(isAlreadyFavorited(favoritePosts, post)) {
            throw new MotelAPIException(HttpStatus.BAD_REQUEST, "Post already favorited");
        }

        favoritePostRepository.addFavoritePost(user.getId(), post.getId(), LocalDateTime.now());
    }

    @Override
    public void removeFavoritePost(Long userId, Long postId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        favoritePostRepository.removeFavoritePostByUserAndPost(user, post);
    }

    public boolean isAlreadyFavorited(Set<FavoritePost> favorites, Post post) {
        return favorites.stream().anyMatch(favorite -> favorite.getPost().equals(post));
    }


    private PostDTO mapToPostDTO(Post post) {
        PostDTO postDTO = mapper.map(post, PostDTO.class);
//        postDTO.getAccommodation().setCategoryId(post.getAccommodation().getCategory().);
//        postDTO.getAccommodation().setCategory(String.valueOf(post.getAccommodation().getCategory().getName()));
        List<String> images = imageService.getImageByPostId(post.getId());
        postDTO.setImageStrings(images);
        return postDTO;
    }
}
