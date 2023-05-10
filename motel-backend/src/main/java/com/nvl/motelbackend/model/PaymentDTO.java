package com.nvl.motelbackend.model;

import lombok.Data;

@Data
public class PaymentDTO {
    private Long id;
    private String orderId;
    private double amount;
    private int status;
}
