package com.scms.backend.dto;

import jakarta.validation.constraints.*;

public record ClassRequest(
        @NotBlank(message = "Class name is required")
        @Size(max = 150)
        String className,

        @NotNull(message = "Sport ID is required")
        Integer sportId,

        @NotNull(message = "Room ID is required")
        Integer roomId,

        @NotNull(message = "Coach ID is required")
        Integer coachId
) {}
