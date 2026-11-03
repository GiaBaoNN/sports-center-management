package com.scms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SupportResolveRequest(
        @NotBlank(message = "Status is required (Open, InProgress, Resolved, Closed)")
        String status,

        @Size(max = 2000)
        String resolution
) {}
