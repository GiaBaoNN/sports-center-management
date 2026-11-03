package com.scms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TrainingResultRequest(
        @NotNull(message = "Plan ID is required")
        Long planId,

        Long scheduleId,

        @NotNull(message = "Member ID is required")
        Integer memberId,

        @NotBlank(message = "Result notes are required")
        @Size(max = 2000)
        String resultNotes,

        @Size(max = 2000)
        String progressComment
) {}
