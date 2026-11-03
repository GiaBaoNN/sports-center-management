package com.scms.backend.controller;

import com.scms.backend.dto.*;
import com.scms.backend.entity.*;
import com.scms.backend.security.UserDetailsImpl;
import com.scms.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Receptionist endpoints for front-desk operations.
 */
@RestController
@RequestMapping("/api/reception")
@PreAuthorize("hasRole('Receptionist')")
@RequiredArgsConstructor
public class ReceptionController {

    private final UserService userService;
    private final MembershipService membershipService;
    private final ClassService classService;

    // ======================== MEMBER LOOKUP ========================

    @GetMapping("/members")
    public ResponseEntity<ApiResponse<List<User>>> getAllMembers() {
        return ResponseEntity.ok(ApiResponse.success(
                userService.getUsersByRole(User.Role.Member)));
    }

    @GetMapping("/members/search")
    public ResponseEntity<ApiResponse<User>> searchMemberByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserByPhone(phone)));
    }

    // ======================== REGISTER MEMBER ========================

    @PostMapping("/members")
    public ResponseEntity<ApiResponse<User>> registerMember(
            @Valid @RequestBody CreateUserRequest request) {
        // Force role = Member for receptionist-created accounts
        CreateUserRequest memberRequest = new CreateUserRequest(
                request.username(), request.password(), request.fullName(),
                request.email(), request.phone(), "Member");
        User user = userService.createUser(memberRequest);
        return ResponseEntity.ok(ApiResponse.success("Member registered", user));
    }

    // ======================== MEMBERSHIP ON BEHALF ========================

    @PostMapping("/memberships/{userId}")
    public ResponseEntity<ApiResponse<Membership>> registerMembershipOnBehalf(
            @PathVariable Integer userId,
            @Valid @RequestBody MembershipRequest request) {
        Membership membership = membershipService.registerMembership(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Membership registered", membership));
    }

    @GetMapping("/memberships/{userId}")
    public ResponseEntity<ApiResponse<List<Membership>>> getMemberMemberships(
            @PathVariable Integer userId) {
        return ResponseEntity.ok(ApiResponse.success(
                membershipService.getMembershipsByUser(userId)));
    }

    // ======================== CASH PAYMENT CONFIRMATION ========================

    @PutMapping("/payments/{paymentId}/confirm-cash")
    public ResponseEntity<ApiResponse<Payment>> confirmCashPayment(
            @PathVariable Long paymentId) {
        Payment payment = membershipService.confirmCashPayment(paymentId);
        return ResponseEntity.ok(ApiResponse.success("Cash payment confirmed", payment));
    }

    // ======================== CLASS REGISTRATION ON BEHALF ========================

    @PostMapping("/classes/{classId}/register/{memberId}")
    public ResponseEntity<ApiResponse<ClassRegistration>> registerOnBehalf(
            @PathVariable Integer classId,
            @PathVariable Integer memberId) {
        ClassRegistration reg = classService.registerForClass(classId, memberId);
        return ResponseEntity.ok(ApiResponse.success("Registered member for class", reg));
    }

    // ======================== PAYMENTS / INVOICES ========================

    @GetMapping("/payments/{userId}")
    public ResponseEntity<ApiResponse<List<Payment>>> getMemberPayments(
            @PathVariable Integer userId) {
        return ResponseEntity.ok(ApiResponse.success(
                membershipService.getPaymentsByUser(userId)));
    }

    @GetMapping("/invoices/{userId}")
    public ResponseEntity<ApiResponse<List<Invoice>>> getMemberInvoices(
            @PathVariable Integer userId) {
        return ResponseEntity.ok(ApiResponse.success(
                membershipService.getInvoicesByUser(userId)));
    }
}
