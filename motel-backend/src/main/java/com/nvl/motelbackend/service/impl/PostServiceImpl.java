package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.config.NotificationEvent;
import com.nvl.motelbackend.entity.Accommodation;
import com.nvl.motelbackend.entity.ActionName;
import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.exception.InsufficientBalanceException;
import com.nvl.motelbackend.exception.MotelAPIException;
import com.nvl.motelbackend.exception.ResourceNotFoundException;
import com.nvl.motelbackend.model.AccommodationDTO;
import com.nvl.motelbackend.model.PostDTO;
import com.nvl.motelbackend.model.SearchDTO;
import com.nvl.motelbackend.repository.PostRepository;
import com.nvl.motelbackend.repository.PostSpecification;
import com.nvl.motelbackend.repository.UserRepository;
import com.nvl.motelbackend.security.CustomUserDetails;
import com.nvl.motelbackend.service.ActionService;
import com.nvl.motelbackend.service.ImageService;
import com.nvl.motelbackend.service.PostService;
import com.nvl.motelbackend.utils.AppConstants;
import com.nvl.motelbackend.utils.PostUtils;
import org.modelmapper.ModelMapper;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    private final UserRepository userRepository;

    private final ActionService actionService;

    private final ImageService imageService;

    private ApplicationEventPublisher applicationEventPublisher;

    ModelMapper mapper = new ModelMapper();

    public PostServiceImpl(PostRepository postRepository, UserRepository userRepository, ActionService actionService, ImageService imageService, ApplicationEventPublisher applicationEventPublisher) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.actionService = actionService;
        this.imageService = imageService;
        this.applicationEventPublisher = applicationEventPublisher;
    }

//    @Scheduled(cron = "0 0 0 * * ?") // run every day at midnight
//    public void autoHidePosts() {
//        List<Post> posts = postRepository.findAll();
//        LocalDateTime now = LocalDateTime.now();
//        for (Post post : posts) {
//            if (Duration.between(post.getCreatedAt(), now).toDays() > post.getNumberOfDays()) {
//                post.setDel(true);
//                postRepository.save(post);
//            }
//        }
//    }

    @Override
    public Page<PostDTO> getAllPost(Pageable page) {
        Page<PostDTO> posts = postRepository.findAll(page)
                .map(this::mapToDTO);

        return posts;
    }

    @Override
    public Page<PostDTO> getAllPostByCategory(Integer categoryId, Pageable pageable) {
        Page<PostDTO> posts = postRepository.findAllByCategory(categoryId, pageable).map(this::mapToDTO);
        return posts;
    }

    @Override
    public Page<PostDTO> getAllPostByApproved(boolean approved, Pageable page) {
        Page<PostDTO> postDTOS;
        if(approved) {
            postDTOS = postRepository.findAllByApprovedAndNotApprovedAndDel(true, false, false, page)
                    .map(this::mapToDTO);
        }
        else {
            postDTOS = postRepository.findAllByApprovedAndNotApproved(false, true, page)
                    .map(this::mapToDTO);
        }
        return postDTOS;
    }

    @Override
    public Page<PostDTO> getPostWaitingApprove(Pageable page) {
        Page<PostDTO> postDTOS = postRepository.findAllByApprovedAndNotApproved(false, false, page)
                .map(this::mapToDTO);
        return postDTOS;
    }


    @Override
    public PostDTO createPost(PostDTO postDTO, String name) {
        User user = userRepository.findByEmail(name).orElseThrow(() -> new ResourceNotFoundException("User", "id", postDTO.getUser().getId()));

        // convert DTO to entity
        Post post = mapToEntity(postDTO);
        post.setDel(false);
        post.setApproved(false);
        post.setNotApproved(false);
        post.setUser(user);
        if(post.getPriority() == 1) {
            final double totalMoney = post.getNumberOfDays() * AppConstants.priorityPrice;
            if (post.getUser().getBalance() < totalMoney) {
                throw new InsufficientBalanceException("Số dư tài khoản không đủ");
            }
            post.getUser().setBalance(post.getUser().getBalance() - totalMoney);
        }


        //Gán value cho accomodation
        Accommodation accommodation = mapper.map(postDTO.getAccommodation(), Accommodation.class);
        accommodation.setPost(post);
        post.setAccommodation(accommodation);

        Post newPost = postRepository.save(post);
        actionService.createAction(post, user, ActionName.CREATE);

        //convert entity to DTO
        PostDTO postResponse = mapToDTO(newPost);
        postResponse.setAccommodation(mapper.map(accommodation, AccommodationDTO.class));

        return postResponse;
    }

    @Override
    public Page<PostDTO> getPostByUserId(Long userId, int page) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return postRepository.findByUser(user, PageRequest.of(page, 10, Sort.by("createdAt").descending()))
                .map(this::mapToDTO);
    }

    @Override
    public Page<PostDTO> getPostByUserEmail(String email, Pageable page) {
        return null;
    }

    @Override
    public PostDTO getPostById(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        return mapToDTO(post);
    }

    @Override
    public Page<PostDTO> searchPost(SearchDTO searchRequest, Pageable page) {
        Specification<Post> spec = new PostSpecification(searchRequest);
        Page<PostDTO> posts = postRepository.findAll(spec, page)
                .map(this::mapToDTO);
        return posts;
    }

    @Override
    public PostDTO updatePost(PostDTO postDto, Long id, Authentication authentication) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        PostUtils.checkPostUpdateAuthorization(post, authentication);

        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        post.setApproved(false);
        post.setNotApproved(false);
        Accommodation accommodation = mapper.map(postDto.getAccommodation(), Accommodation.class);
        accommodation.setPost(post);
        post.setAccommodation(accommodation);

        Post updatedPost = postRepository.save(post);
        return mapToDTO(updatedPost);
    }

    @Override
    public PostDTO hidePost(Long id, Authentication authentication) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        PostUtils.checkPostUpdateAuthorization(post, authentication);
        post.setDel(true);
        Post hidePost = postRepository.save(post);
        return mapToDTO(hidePost);
    }

    @Override
    public void deletePostById(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        postRepository.delete(post);
    }

    @Override
    public PostDTO approvePost(Long id, String usernameApproved, boolean isApprove) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        if (isApprove) {
            User user = userRepository.findByEmail(usernameApproved).orElseThrow(() -> new MotelAPIException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản: " + usernameApproved));
            post.setApproved(true);
            post.setNotApproved(false);
            actionService.createAction(post, user, ActionName.APPROVE);
            applicationEventPublisher.publishEvent(new NotificationEvent(this, post));

        }
        else {
            User user = userRepository.findByEmail(usernameApproved).orElseThrow(() -> new MotelAPIException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản: " + usernameApproved));
            post.setApproved(false);
            post.setNotApproved(true);
            actionService.createAction(post, user, ActionName.BLOCK);
            applicationEventPublisher.publishEvent(new NotificationEvent(this, post));

        }

        Post updatedPost = postRepository.save(post);
        return mapToDTO(updatedPost);
    }


    private PostDTO mapToDTO(Post post) {
        PostDTO postDTO = mapper.map(post, PostDTO.class);
//        postDTO.getAccommodation().setCategoryId(post.getAccommodation().getCategory().);
//        postDTO.getAccommodation().setCategory(String.valueOf(post.getAccommodation().getCategory().getName()));
        List<String> images = imageService.getImageByPostId(post.getId());
        postDTO.setImageStrings(images);
        return postDTO;
    }

    private Post mapToEntity(PostDTO postDTO) {
        Post post = mapper.map(postDTO, Post.class);
        return post;
    }

    private boolean isAuthorizedToHidePost(Authentication authentication, Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getId();


        if (authentication.getAuthorities().stream().anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            // Admin can hide any post
            return true;
        } else if (authentication.getAuthorities().stream().anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_USER"))) {
            // User can only hide their own post
            if (authentication.getName().equals(authentication.getName())) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }


}
