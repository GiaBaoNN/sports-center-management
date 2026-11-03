package com.scms.backend.repository;

import com.scms.backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByPaymentPaymentId(Long paymentId);

    @Query("SELECT i FROM Invoice i JOIN i.payment p JOIN p.membership m WHERE m.user.userId = :userId ORDER BY i.issueDate DESC")
    List<Invoice> findByUserId(@Param("userId") Integer userId);
}
