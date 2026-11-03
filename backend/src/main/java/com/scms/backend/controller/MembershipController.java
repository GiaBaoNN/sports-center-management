package com.scms.backend.controller;

import com.scms.backend.dto.ApiResponse;
import com.scms.backend.dto.MembershipRequest;
import com.scms.backend.entity.*;
import com.scms.backend.security.UserDetailsImpl;
import com.scms.backend.service.MembershipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memberships")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;

    /** Member: view my memberships */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Membership>>> getMyMemberships(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(ApiResponse.success(
                membershipService.getMembershipsByUser(principal.getUserId())));
    }

    /** Member: view my active membership */
    @GetMapping("/my/active")
    public ResponseEntity<ApiResponse<Membership>> getMyActiveMembership(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(ApiResponse.success(
                membershipService.getActiveMembership(principal.getUserId())));
    }

    /** Member: register/renew membership */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Membership>> registerMembership(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody MembershipRequest request) {
        Membership membership = membershipService.registerMembership(
                principal.getUserId(), request);
        return ResponseEntity.ok(ApiResponse.success("Membership registered", membership));
    }

    /** Member: view my payment history */
    @GetMapping("/my/payments")
    public ResponseEntity<ApiResponse<List<Payment>>> getMyPayments(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(ApiResponse.success(
                membershipService.getPaymentsByUser(principal.getUserId())));
    }

    /** Member: view my invoices */
    @GetMapping("/my/invoices")
    public ResponseEntity<ApiResponse<List<Invoice>>> getMyInvoices(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(ApiResponse.success(
                membershipService.getInvoicesByUser(principal.getUserId())));
    }
}
