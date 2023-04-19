package com.nvl.motelbackend.exception;

import org.springframework.http.HttpStatus;

public class MotelAPIException extends RuntimeException{
    private HttpStatus status;
    private String message;

    public MotelAPIException(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public MotelAPIException(String message, HttpStatus status, String message1) {
        super(message);
        this.status = status;
        this.message = message1;
    }

    public HttpStatus getStatus() {
        return status;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
