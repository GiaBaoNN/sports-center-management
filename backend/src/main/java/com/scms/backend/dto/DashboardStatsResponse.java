package com.scms.backend.dto;

import java.math.BigDecimal;
import java.util.Map;

public record DashboardStatsResponse(
        long totalUsers,
        long activeMembers,
        long expiringMembershipsCount,
        BigDecimal totalRevenue,
        long totalClasses,
        long upcomingClasses,
        long completedClasses,
        long totalRegistrations,
        Map<String, Long> membersByRole,
        Map<String, Long> membershipsByPackage
) {}
