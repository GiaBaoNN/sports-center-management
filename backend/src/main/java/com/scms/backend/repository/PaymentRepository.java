package com.scms.backend.repository;

import com.scms.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByMembershipMembershipId(Long membershipId);

    List<Payment> findByStatus(Payment.Status status);

    Optional<Payment> findByMomoOrderId(String momoOrderId);

    @Query("SELECT p FROM Payment p JOIN p.membership m WHERE m.user.userId = :userId ORDER BY p.paymentDate DESC")
    List<Payment> findByUserId(@Param("userId") Integer userId);
}
