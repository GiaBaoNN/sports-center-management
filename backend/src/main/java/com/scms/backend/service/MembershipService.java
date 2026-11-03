package com.scms.backend.service;

import com.scms.backend.dto.MembershipRequest;
import com.scms.backend.entity.*;
import com.scms.backend.exception.*;
import com.scms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final MembershipPackageRepository packageRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public List<Membership> getMembershipsByUser(Integer userId) {
        return membershipRepository.findByUserUserId(userId);
    }

    public Membership getActiveMembership(Integer userId) {
        return membershipRepository.findByUserUserIdAndStatus(userId, Membership.Status.Active)
                .orElse(null);
    }

    public Membership getMembershipById(Long id) {
        return membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership", "id", id));
    }

    /**
     * Register or renew a membership. Creates a Pending membership + Pending payment.
     * For Cash: receptionist confirms later.
     * For MoMo: callback confirms later.
     */
    @Transactional
    public Membership registerMembership(Integer userId, MembershipRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.getRole() != User.Role.Member) {
            throw new BadRequestException("Only members can have memberships");
        }

        // Check no existing active membership
        membershipRepository.findByUserUserIdAndStatus(userId, Membership.Status.Active)
                .ifPresent(m -> {
                    throw new BadRequestException("User already has an active membership (ID: "
                            + m.getMembershipId() + ")");
                });

        MembershipPackage pkg = packageRepository.findById(request.packageId())
                .orElseThrow(() -> new ResourceNotFoundException("MembershipPackage", "id", request.packageId()));

        if (!pkg.getIsActive()) {
            throw new BadRequestException("Package '" + pkg.getName() + "' is no longer available");
        }

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(pkg.getDurationDays());

        Membership membership = Membership.builder()
                .user(user)
                .membershipPackage(pkg)
                .startDate(startDate)
                .endDate(endDate)
                .status(Membership.Status.Pending)
                .build();
        membership = membershipRepository.save(membership);

        // Create corresponding payment
        Payment.PaymentMethod method = Payment.PaymentMethod.valueOf(request.paymentMethod());

        Payment payment = Payment.builder()
                .membership(membership)
                .amount(pkg.getPrice())
                .paymentDate(LocalDateTime.now())
                .paymentMethod(method)
                .status(Payment.Status.Pending)
                .build();
        paymentRepository.save(payment);

        return membership;
    }

    /**
     * Confirm a cash payment — activates the membership and creates an invoice.
     */
    @Transactional
    public Payment confirmCashPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        if (payment.getStatus() != Payment.Status.Pending) {
            throw new BadRequestException("Payment is not in Pending status");
        }
        if (payment.getPaymentMethod() != Payment.PaymentMethod.Cash) {
            throw new BadRequestException("This is not a Cash payment");
        }

        payment.setStatus(Payment.Status.Paid);
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);

        // Activate membership
        Membership membership = payment.getMembership();
        membership.setStatus(Membership.Status.Active);
        membership.setStartDate(LocalDate.now());
        membership.setEndDate(LocalDate.now().plusDays(
                membership.getMembershipPackage().getDurationDays()));
        membershipRepository.save(membership);

        // Create invoice
        Invoice invoice = Invoice.builder()
                .payment(payment)
                .issueDate(LocalDateTime.now())
                .totalAmount(payment.getAmount())
                .build();
        invoiceRepository.save(invoice);

        return payment;
    }

    /**
     * Handle MoMo callback — activates membership if result is successful.
     */
    @Transactional
    public Payment handleMoMoCallback(String momoOrderId, String momoTransactionId, boolean success) {
        Payment payment = paymentRepository.findByMomoOrderId(momoOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "momoOrderId", momoOrderId));

        if (payment.getStatus() != Payment.Status.Pending) {
            throw new BadRequestException("Payment is not in Pending status");
        }

        if (success) {
            payment.setStatus(Payment.Status.Paid);
            payment.setMomoTransactionId(momoTransactionId);
            paymentRepository.save(payment);

            Membership membership = payment.getMembership();
            membership.setStatus(Membership.Status.Active);
            membershipRepository.save(membership);

            Invoice invoice = Invoice.builder()
                    .payment(payment)
                    .issueDate(LocalDateTime.now())
                    .totalAmount(payment.getAmount())
                    .build();
            invoiceRepository.save(invoice);
        } else {
            payment.setStatus(Payment.Status.Failed);
            paymentRepository.save(payment);
        }

        return payment;
    }

    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }

    public List<Payment> getPaymentsByUser(Integer userId) {
        return paymentRepository.findByUserId(userId);
    }

    public List<Invoice> getInvoicesByUser(Integer userId) {
        return invoiceRepository.findByUserId(userId);
    }
}
