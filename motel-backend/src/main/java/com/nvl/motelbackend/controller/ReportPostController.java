package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.interceptor.RateLimit;
import com.nvl.motelbackend.model.ReportPostDTO;
import com.nvl.motelbackend.service.ReportPostService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Api(value = "REST API Report Post")
@RestController
@RequestMapping("/api/report-posts")
public class ReportPostController {
    private final ReportPostService reportPostService;

    public ReportPostController(ReportPostService reportPostService) {
        this.reportPostService = reportPostService;
    }

    @ApiOperation("Lấy tất cả báo cáo")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @GetMapping
    public Page<ReportPostDTO> getAllReportPost(@PageableDefault(page = 0, size = 10, sort = "timeReport", direction = Sort.Direction.DESC) Pageable page) {
        return reportPostService.getAllReportPost(page);
    }

    @RateLimit
    @PostMapping
    public ResponseEntity<ReportPostDTO> addReportPost(@RequestBody ReportPostDTO reportPostDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportPostService.addReportPost(reportPostDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<?> removeReportPost(@PathVariable Long id) {
        reportPostService.removeReportPost(id);
        return ResponseEntity.ok("Report with id: " + id + " has been removed");
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<?> deleteReportPosts(@RequestBody List<Long> reportIds) {
        reportPostService.deleteReportPosts(reportIds);
        return ResponseEntity.ok().build();
    }
}
