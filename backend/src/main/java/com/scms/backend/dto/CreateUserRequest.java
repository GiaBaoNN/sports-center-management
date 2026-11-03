package com.scms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50)
        String username,

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 100)
        String password,

        @NotBlank(message = "Full name is required")
        @Size(max = 100)
        String fullName,

        String email,

        @NotBlank(message = "Phone is required")
        @jakarta.validation.constraints.Pattern(regexp = "^\\d{10,11}$", message = "Phone must be 10-11 digits")
        String phone,

        @NotNull(message = "Role is required")
        String role
) {}
