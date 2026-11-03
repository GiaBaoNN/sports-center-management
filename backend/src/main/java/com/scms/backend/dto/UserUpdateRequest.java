package com.scms.backend.dto;

import jakarta.validation.constraints.*;

public record UserUpdateRequest(
        @Size(min = 3, max = 50, message = "Username must be 3-50 characters")
        String username,

        @Size(max = 100)
        String fullName,

        @Email(message = "Invalid email format")
        String email,

        @Pattern(regexp = "^\\d{10,11}$", message = "Phone must be 10-11 digits")
        String phone
) {}
