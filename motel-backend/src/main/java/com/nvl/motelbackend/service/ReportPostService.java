package com.nvl.motelbackend.service;

import com.nvl.motelbackend.model.ReportPostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReportPostService {

    Page<ReportPostDTO> getAllReportPost(Pageable page);
    ReportPostDTO addReportPost(ReportPostDTO reportPostDTO);
    void removeReportPost(Long reportPostId);

    void deleteReportPosts(List<Long> reportIds);
}
