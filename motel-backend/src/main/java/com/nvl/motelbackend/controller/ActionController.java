package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.model.ActionDTO;
import com.nvl.motelbackend.service.ActionService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api("Rest API hoạt động")
@RestController
@RequestMapping("/api/actions")
public class ActionController {

    private final ActionService actionService;

    public ActionController(ActionService actionService) {
        this.actionService = actionService;
    }

    @ApiOperation("Lấy tất cả hoạt động")
    @GetMapping
    public Page<ActionDTO> getAllAction(Pageable page) {
        return actionService.getAllAction(page);
    }

    @ApiOperation("Lấy tất cả hoạt động của một người dùng")
    @GetMapping("/user/{id}")
    public Page<ActionDTO> getAllActionByUserId(@PathVariable Long id, @PageableDefault(page = 0, size = 5, sort = "time", direction = Sort.Direction.DESC) Pageable page) {
        return actionService.getActionByUser(id, page);
    }
}
