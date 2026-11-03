package com.scms.backend.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be 3-50 characters")
        String username,

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 100, message = "Password must be 6-100 characters")
        String password,

        @NotBlank(message = "Full name is required")
        @Size(max = 100)
        String fullName,

        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^\\d{10,11}$", message = "Phone must be 10-11 digits")
        String phone
) {}
