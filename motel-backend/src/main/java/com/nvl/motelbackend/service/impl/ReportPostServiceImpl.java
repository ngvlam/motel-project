package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.ReportPost;
import com.nvl.motelbackend.exception.ResourceNotFoundException;
import com.nvl.motelbackend.model.PostDTO;
import com.nvl.motelbackend.model.ReportPostDTO;
import com.nvl.motelbackend.repository.PostRepository;
import com.nvl.motelbackend.repository.ReportPostRepository;
import com.nvl.motelbackend.service.ReportPostService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportPostServiceImpl implements ReportPostService {

    private final ReportPostRepository reportPostRepository;
    private final PostRepository postRepository;

    public ReportPostServiceImpl(ReportPostRepository reportPostRepository, PostRepository postRepository) {
        this.reportPostRepository = reportPostRepository;
        this.postRepository = postRepository;
    }

    ModelMapper mapper = new ModelMapper();

    @Override
    public Page<ReportPostDTO> getAllReportPost(Pageable page) {
        Page<ReportPostDTO> reportPostDTOS = reportPostRepository.findAll(page)
                .map(this::mapToDTO);

        return reportPostDTOS;
    }

    @Override
    public ReportPostDTO addReportPost(ReportPostDTO reportPostDTO) {
        Post post = postRepository.findById(reportPostDTO.getPostId()).orElseThrow(() -> new ResourceNotFoundException("Post", "id", reportPostDTO.getPostId()));

        ReportPost reportPost = mapToEntity(reportPostDTO);
        reportPost.setTimeReport(LocalDateTime.now());
        ReportPost reportPost1 = reportPostRepository.save(reportPost);

        ReportPostDTO reportPostResponse = mapToDTO(reportPost1);

        return reportPostResponse;
    }

    @Override
    public void removeReportPost(Long reportPostId) {
        ReportPost reportPost = reportPostRepository.findById(reportPostId).orElseThrow(() -> new ResourceNotFoundException("Report", "id", reportPostId));
        reportPostRepository.delete(reportPost);
    }

    @Override
    public void deleteReportPosts(List<Long> reportIds) {
        for (Long reportId : reportIds) {
            reportPostRepository.findById(reportId).orElseThrow(() -> new ResourceNotFoundException("Report", "id", reportId));
            reportPostRepository.deleteById(reportId);
        }
    }

    private ReportPostDTO mapToDTO(ReportPost reportPost) {
        ReportPostDTO reportPostDTO = mapper.map(reportPost, ReportPostDTO.class);
        return reportPostDTO;
    }

    private ReportPost mapToEntity(ReportPostDTO reportPostDTO) {
        ReportPost reportPost = mapper.map(reportPostDTO, ReportPost.class);
        return reportPost;
    }

}
