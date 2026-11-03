package com.scms.backend.dto;

import jakarta.validation.constraints.*;

public record MembershipRequest(
        @NotNull(message = "Package ID is required")
        Integer packageId,

        @NotBlank(message = "Payment method is required")
        @Pattern(regexp = "^(Cash|MoMo)$", message = "Payment method must be Cash or MoMo")
        String paymentMethod
) {}
