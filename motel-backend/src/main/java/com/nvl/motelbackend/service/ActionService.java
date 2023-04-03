package com.nvl.motelbackend.service;

import com.nvl.motelbackend.entity.ActionName;
import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.User;

public interface ActionService {
    void createAction(Post post, User user, ActionName approve);
}
