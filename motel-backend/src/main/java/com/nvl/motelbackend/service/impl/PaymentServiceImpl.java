package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.entity.Payment;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.exception.MotelAPIException;
import com.nvl.motelbackend.exception.ResourceNotFoundException;
import com.nvl.motelbackend.repository.PaymentRepository;
import com.nvl.motelbackend.repository.UserRepository;
import com.nvl.motelbackend.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    @Value("${vnpay.key.password}")
    private String encryptPass;

    @Value("${vnpay.key.secret}")
    private String vnPaySecretKey;

    public PaymentServiceImpl(PaymentRepository paymentRepository, UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public boolean checkExistOrderId(String orderId) {
        return paymentRepository.existsByOrderId(orderId);
    }

    @Override
    public List<Payment> getPaymentsByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("id", "User", userId));
        return paymentRepository.findAllByUserOrderByCreatedAtDesc(user);
    }

    @Override
    public Payment getPaymentByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId).orElseThrow(() -> new MotelAPIException(HttpStatus.NOT_FOUND, "Không tìm thấy mã đơn hàng"));
    }

    @Override
    public boolean checkValidAmount(double amount) {
        return false;
    }

    @Override
    public Payment addPayment(Long userId, Payment payment, String encryptedKey, String salt){
//        String decryptedKey = AESUtil.decrypt(encryptedKey, encryptPass, salt);
//
//        if (decryptedKey != vnPaySecretKey) {
//            throw new MotelAPIException(HttpStatus.BAD_REQUEST, "Checksum không hợp lệ");
//        }

        boolean isHaveOrder = checkExistOrderId(payment.getOrderId());
        if(isHaveOrder) {
            throw new MotelAPIException(HttpStatus.CONFLICT, "Đã tồn tại đơn: " + payment.getOrderId());
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("id", "User", userId));
        payment.setStatus(0);
        payment.setUser(user);
        return paymentRepository.save(payment);
    }

    @Override
    public Payment updatePayment(String orderId, int status) {
        Payment payment = getPaymentByOrderId(orderId);
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }


}
