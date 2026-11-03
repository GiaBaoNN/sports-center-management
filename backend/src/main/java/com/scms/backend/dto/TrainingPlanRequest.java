package com.scms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TrainingPlanRequest(
        Integer memberId,
        Integer classId,

        @NotBlank(message = "Goals are required")
        @Size(max = 1000)
        String goals,

        @Size(max = 2000)
        String aiRecommendation
) {}
