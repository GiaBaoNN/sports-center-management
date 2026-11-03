package com.scms.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record PackageRequest(
        @NotBlank(message = "Package name is required")
        @Size(max = 100)
        String name,

        @Size(max = 500)
        String description,

        @NotNull(message = "Duration is required")
        @Min(value = 1, message = "Duration must be positive")
        Integer durationDays,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.00", message = "Price must be non-negative")
        BigDecimal price
) {}
