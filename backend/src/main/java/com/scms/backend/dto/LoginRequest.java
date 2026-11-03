package com.scms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^\\d{10,11}$", message = "Phone must be 10-11 digits")
        String phone,

        @NotBlank(message = "Password is required")
        String password
) {}
