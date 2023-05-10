package com.nvl.motelbackend.config;
import com.nvl.motelbackend.entity.Post;
import org.springframework.context.ApplicationEvent;

public class NotificationEvent extends ApplicationEvent {

    private Post post;

    public NotificationEvent(Object source, Post post) {
        super(source);
        this.post = post;
    }

    public Post getPost() {
        return post;
    }
}
