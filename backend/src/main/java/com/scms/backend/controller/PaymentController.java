package com.scms.backend.controller;

import com.scms.backend.dto.ApiResponse;
import com.scms.backend.dto.MomoInitResponse;
import com.scms.backend.entity.Payment;
import com.scms.backend.exception.BadRequestException;
import com.scms.backend.exception.ResourceNotFoundException;
import com.scms.backend.repository.PaymentRepository;
import com.scms.backend.service.MembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final MembershipService membershipService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Payment>> getPayment(@PathVariable Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    /**
     * Initiate MoMo payment flow. Returns an order ID and simulated payment gateway checkout URL.
     */
    @PostMapping("/{paymentId}/momo/initiate")
    public ResponseEntity<ApiResponse<MomoInitResponse>> initiateMomoPayment(
            @PathVariable Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        if (payment.getStatus() != Payment.Status.Pending) {
            throw new BadRequestException("Payment is already " + payment.getStatus());
        }

        String orderId = "SCMS-MOMO-" + System.currentTimeMillis();
        payment.setMomoOrderId(orderId);
        paymentRepository.save(payment);

        // Simulation URL for development/demo; can be replaced with real MoMo endpoint
        String payUrl = "https://test-payment.momo.vn/v2/gateway/pay?orderId=" + orderId;
        String qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + orderId;

        return ResponseEntity.ok(ApiResponse.success("MoMo payment initiated",
                new MomoInitResponse(orderId, payUrl, qrCodeUrl, payment.getAmount(), "Order generated")));
    }

    /**
     * MoMo callback / webhook endpoint.
     * Accessible publicly or simulated from frontend when completing checkout.
     */
    @PostMapping("/momo/callback")
    public ResponseEntity<ApiResponse<Payment>> momoCallback(@RequestBody Map<String, Object> payload) {
        String orderId = (String) payload.get("orderId");
        if (orderId == null) {
            throw new BadRequestException("orderId is required");
        }

        String transId = (String) payload.getOrDefault("transId", "MOMO-TXN-" + UUID.randomUUID().toString().substring(0, 8));
        Object resultCodeObj = payload.get("resultCode");
        boolean isSuccess = resultCodeObj != null && (resultCodeObj.equals(0) || resultCodeObj.equals("0"));

        Payment payment = membershipService.handleMoMoCallback(orderId, transId, isSuccess);
        return ResponseEntity.ok(ApiResponse.success("Payment processed", payment));
    }
}
