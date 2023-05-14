package com.nvl.motelbackend.service.impl;

import com.nvl.motelbackend.config.VNPayClient;
import com.nvl.motelbackend.entity.Payment;
import com.nvl.motelbackend.entity.User;
import com.nvl.motelbackend.exception.MotelAPIException;
import com.nvl.motelbackend.exception.ResourceNotFoundException;
import com.nvl.motelbackend.model.VNPayResponse;
import com.nvl.motelbackend.repository.PaymentRepository;
import com.nvl.motelbackend.repository.UserRepository;
import com.nvl.motelbackend.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

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
    public Payment addPayment(Long userId, Payment payment, String encryptedKey, String salt) {
//        String decryptedKey = AESUtil.decrypt(encryptedKey, encryptPass, salt);
//
//        if (decryptedKey != vnPaySecretKey) {
//            throw new MotelAPIException(HttpStatus.BAD_REQUEST, "Checksum không hợp lệ");
//        }

        boolean isHaveOrder = checkExistOrderId(payment.getOrderId());
        if (isHaveOrder) {
            throw new MotelAPIException(HttpStatus.CONFLICT, "Đã tồn tại đơn: " + payment.getOrderId());
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("id", "User", userId));
        payment.setStatus(0);
        payment.setUser(user);
        return paymentRepository.save(payment);
    }

    @Override
    public Payment updatePayment(String orderId, int status, double amount) {
        Payment payment = getPaymentByOrderId(orderId);
        payment.setStatus(status);
        if(status == 1) {
            payment.getUser().setBalance(payment.getUser().getBalance() + amount);
        }
        return paymentRepository.save(payment);
    }

    @Override
    public Payment handleResponse(HttpServletRequest request) throws UnsupportedEncodingException {
        VNPayClient vnPayClient = new VNPayClient();
        Map<String, String> vnpParams = vnPayClient.getParamsFromRequest(request);

        if (vnPayClient.validateSignature(vnpParams)) {
            String vnp_ResponseCode = vnpParams.get("vnp_ResponseCode");
            double amount = Double.parseDouble(vnpParams.get("vnp_Amount"))/100;

            int status;
            if(vnp_ResponseCode.equals("00")) {
                status = 1;
            }else  {
                status = 2;
            }

            return updatePayment(vnpParams.get("vnp_TxnRef"), status, amount);

        } else {
            // Handle the invalid signature
            throw  new MotelAPIException(HttpStatus.BAD_REQUEST, "Invalid signature VNPay");
        }
    }
}
