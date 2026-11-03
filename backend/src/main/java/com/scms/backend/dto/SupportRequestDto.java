package com.scms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SupportRequestDto(
        @NotBlank(message = "Subject is required")
        @Size(max = 150)
        String subject,

        @NotBlank(message = "Description is required")
        @Size(max = 2000)
        String description
) {}
