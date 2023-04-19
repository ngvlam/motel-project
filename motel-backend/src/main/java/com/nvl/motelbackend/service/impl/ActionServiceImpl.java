package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.entity.Action;
import com.nvl.motelbackend.entity.ActionName;
import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.exception.ResourceNotFoundException;
import com.nvl.motelbackend.model.ActionDTO;
import com.nvl.motelbackend.repository.ActionRepository;
import com.nvl.motelbackend.repository.UserRepository;
import com.nvl.motelbackend.service.ActionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ActionServiceImpl implements ActionService {
    private final ActionRepository actionRepository;
    private final UserRepository userRepository;

    public ActionServiceImpl(ActionRepository actionRepository, UserRepository userRepository) {
        this.actionRepository = actionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void createAction(Post post, User user, ActionName approve) {

    }

    @Override
    public Page<ActionDTO> getAllAction(Pageable page) {
        Page<Action> actions = actionRepository.findAll(page);

        Page<ActionDTO> actionDTOS = actions.map(action ->
                new ActionDTO(action.getId(), action.getUser().getFullName(), action.getAction(), action.getPost().getTitle(), action.getPost().getId(), action.getTime())
        );
        return actionDTOS;
    }

    @Override
    public Page<ActionDTO> getActionByUser(Long id, Pageable page) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "User", id));
        Page<Action> actions = actionRepository.findAllByUser(user, page);

        Page<ActionDTO> actionDTOS = actions.map(action ->
                new ActionDTO(action.getId(), action.getUser().getFullName(), action.getAction(), action.getPost().getTitle(), action.getPost().getId(), action.getTime())
        );
        return actionDTOS;
    }
}
