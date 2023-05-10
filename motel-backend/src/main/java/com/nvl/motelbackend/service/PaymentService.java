package com.nvl.motelbackend.service;

import com.nvl.motelbackend.entity.Payment;
import com.nvl.motelbackend.entity.User;

import java.util.List;

public interface PaymentService {
    boolean checkExistOrderId(String orderId);

    List<Payment> getPaymentsByUserId(Long userId);

    Payment getPaymentByOrderId(String orderId);
    boolean checkValidAmount(double amount);

    Payment addPayment(Long userId, Payment payment, String  encryptedKey, String salt);

    Payment updatePayment(String orderId, int status);
}
