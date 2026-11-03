package com.scms.backend.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ScheduleRequest(
        @NotNull(message = "Class ID is required")
        Integer classId,

        @NotNull(message = "Class date is required")
        LocalDate classDate,

        @NotNull(message = "Start time is required")
        LocalDateTime startDatetime,

        @NotNull(message = "End time is required")
        LocalDateTime endDatetime
) {}
