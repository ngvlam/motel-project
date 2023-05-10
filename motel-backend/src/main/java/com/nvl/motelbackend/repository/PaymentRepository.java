package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Payment;
import com.nvl.motelbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    boolean existsByOrderId(String orderId);
    Optional<Payment> findByOrderId(String orderId);

    List<Payment> findAllByUserOrderByCreatedAtDesc(User user);

}
