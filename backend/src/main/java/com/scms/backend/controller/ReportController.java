package com.scms.backend.controller;

import com.scms.backend.dto.ApiResponse;
import com.scms.backend.dto.DashboardStatsResponse;
import com.scms.backend.entity.AuditLog;
import com.scms.backend.service.AuditLogService;
import com.scms.backend.service.DashboardReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasRole('Manager')")
@RequiredArgsConstructor
public class ReportController {

    private final DashboardReportService dashboardReportService;
    private final AuditLogService auditLogService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(
                dashboardReportService.getDashboardStats()));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                auditLogService.getAllAuditLogs(PageRequest.of(page, size))));
    }
}
