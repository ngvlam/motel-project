package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.entity.ActionName;
import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.service.ActionService;
import org.springframework.stereotype.Service;

@Service
public class ActionServiceImpl implements ActionService {
    @Override
    public void createAction(Post post, User user, ActionName approve) {

    }
}
