package com.scms.backend.controller;

import com.scms.backend.dto.ApiResponse;
import com.scms.backend.dto.SupportRequestDto;
import com.scms.backend.dto.SupportResolveRequest;
import com.scms.backend.entity.SupportRequest;
import com.scms.backend.security.UserDetailsImpl;
import com.scms.backend.service.SupportRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportRequestService supportRequestService;

    // ======================== MEMBER ENDPOINTS ========================

    @PostMapping
    public ResponseEntity<ApiResponse<SupportRequest>> createRequest(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody SupportRequestDto dto) {
        SupportRequest req = supportRequestService.createRequest(principal.getUserId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Support request submitted", req));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<SupportRequest>>> getMyRequests(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(ApiResponse.success(
                supportRequestService.getRequestsByMember(principal.getUserId())));
    }

    // ======================== STAFF (RECEPTIONIST / MANAGER) ========================

    @GetMapping
    @PreAuthorize("hasAnyRole('Receptionist', 'Manager')")
    public ResponseEntity<ApiResponse<Page<SupportRequest>>> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<SupportRequest> result = supportRequestService.getAllRequests(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('Receptionist', 'Manager')")
    public ResponseEntity<ApiResponse<List<SupportRequest>>> getByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(ApiResponse.success(
                supportRequestService.getRequestsByStatus(status)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('Receptionist', 'Manager')")
    public ResponseEntity<ApiResponse<SupportRequest>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                supportRequestService.getRequestById(id)));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('Receptionist', 'Manager')")
    public ResponseEntity<ApiResponse<SupportRequest>> updateStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody SupportResolveRequest dto) {
        SupportRequest req = supportRequestService.updateStatus(id, principal.getUserId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Support request updated", req));
    }
}
