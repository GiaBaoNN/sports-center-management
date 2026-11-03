package com.scms.backend.dto;

import java.math.BigDecimal;

public record MomoInitResponse(
        String orderId,
        String payUrl,
        String qrCodeUrl,
        BigDecimal amount,
        String message
) {}
