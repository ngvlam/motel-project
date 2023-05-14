package com.nvl.motelbackend.service;

import com.nvl.motelbackend.entity.Payment;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.model.VNPayResponse;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.List;

public interface PaymentService {
    boolean checkExistOrderId(String orderId);

    List<Payment> getPaymentsByUserId(Long userId);

    Payment getPaymentByOrderId(String orderId);
    boolean checkValidAmount(double amount);

    Payment addPayment(Long userId, Payment payment, String  encryptedKey, String salt);

    Payment updatePayment(String orderId, int status, double amount);

    Payment handleResponse(HttpServletRequest request) throws UnsupportedEncodingException;
}
