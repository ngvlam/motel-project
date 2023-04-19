package com.nvl.motelbackend.service;

import com.nvl.motelbackend.entity.ActionName;
import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.model.ActionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ActionService {
    void createAction(Post post, User user, ActionName approve);
    Page<ActionDTO> getAllAction(Pageable page);

    Page<ActionDTO> getActionByUser(Long id, Pageable page);
}
