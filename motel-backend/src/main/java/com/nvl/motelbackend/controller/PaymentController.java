package com.nvl.motelbackend.controller;

import com.nvl.motelbackend.entity.Payment;
import com.nvl.motelbackend.model.VNPayResponse;
import com.nvl.motelbackend.security.CustomUserDetails;
import com.nvl.motelbackend.service.PaymentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.List;

@Api("Rest Api thanh toán")
@RestController
@RequestMapping("/api")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @ApiOperation("Lấy thanh toán theo mã đơn")
    @GetMapping("/payments/{orderId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MODERATOR')")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable String orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }

    @ApiOperation("Thêm thanh toán")
    @PostMapping("/payments")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MODERATOR')")
    public ResponseEntity<Payment> addPayment(Authentication authentication, @RequestBody Payment payment, @RequestParam String encryptedKey, @RequestParam String hashedSalt)  {
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(paymentService.addPayment(user.getId(), payment, encryptedKey, hashedSalt));
    }

//    @ApiOperation("Cập nhật trạng thái thanh toán")
//    @PutMapping("/payments/{orderId}/status/{status}")
//    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MODERATOR')")
//    public ResponseEntity<Payment> updateStatus(Authentication authentication, @PathVariable String orderId, @PathVariable int status)  {
//        return ResponseEntity.ok(paymentService.updatePayment(orderId, status));
//    }
//
//    @PostMapping("/vnpay")
//    public ResponseEntity<?> createVNPayPayment(@RequestBody VNPayRequest vnPayRequest) {
//        String paymentUrl = paymentService.createPayment(vnPayRequest);
//        return ResponseEntity.ok(paymentUrl);
//    }

    @ApiOperation("Cập nhật trạng thái thanh toán")
    @PutMapping("/payments/vnpay/response")
    public ResponseEntity<?> handleVNPayResponse(HttpServletRequest request) throws UnsupportedEncodingException {
        Payment payment = paymentService.handleResponse(request);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/users/{userId}/payments")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MODERATOR')")
    public ResponseEntity<List<Payment>> getPaymentsByUserId(@PathVariable Long userId, Authentication authentication) {
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

        if (user.getId().equals(userId) || authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            // Logic to get payments by user ID
            List<Payment> payments = paymentService.getPaymentsByUserId(userId);
            return ResponseEntity.ok(payments);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
