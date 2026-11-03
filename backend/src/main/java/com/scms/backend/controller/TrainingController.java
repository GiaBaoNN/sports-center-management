package com.scms.backend.controller;

import com.scms.backend.dto.ApiResponse;
import com.scms.backend.dto.TrainingPlanRequest;
import com.scms.backend.dto.TrainingResultRequest;
import com.scms.backend.entity.TrainingPlan;
import com.scms.backend.entity.TrainingResult;
import com.scms.backend.security.UserDetailsImpl;
import com.scms.backend.service.TrainingPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training")
@RequiredArgsConstructor
public class TrainingController {

    private final TrainingPlanService trainingPlanService;

    // ======================== MEMBER ENDPOINTS ========================

    @GetMapping("/my-plans")
    public ResponseEntity<ApiResponse<List<TrainingPlan>>> getMyPlans(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(ApiResponse.success(
                trainingPlanService.getPlansByMember(principal.getUserId())));
    }

    @GetMapping("/my-results")
    public ResponseEntity<ApiResponse<List<TrainingResult>>> getMyResults(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(ApiResponse.success(
                trainingPlanService.getResultsByMember(principal.getUserId())));
    }

    // ======================== COACH ENDPOINTS ========================

    @GetMapping("/coach-plans")
    @PreAuthorize("hasRole('Coach')")
    public ResponseEntity<ApiResponse<List<TrainingPlan>>> getCoachPlans(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(ApiResponse.success(
                trainingPlanService.getPlansByCoach(principal.getUserId())));
    }

    @PostMapping("/plans")
    @PreAuthorize("hasRole('Coach')")
    public ResponseEntity<ApiResponse<TrainingPlan>> createPlan(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody TrainingPlanRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Training plan created",
                trainingPlanService.createPlan(principal.getUserId(), request)));
    }

    @PutMapping("/plans/{id}")
    @PreAuthorize("hasRole('Coach')")
    public ResponseEntity<ApiResponse<TrainingPlan>> updatePlan(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody TrainingPlanRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Training plan updated",
                trainingPlanService.updatePlan(id, principal.getUserId(), request)));
    }

    @PostMapping("/results")
    @PreAuthorize("hasRole('Coach')")
    public ResponseEntity<ApiResponse<TrainingResult>> recordResult(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody TrainingResultRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Training result recorded",
                trainingPlanService.recordResult(principal.getUserId(), request)));
    }

    @GetMapping("/plans/{planId}/results")
    public ResponseEntity<ApiResponse<List<TrainingResult>>> getPlanResults(
            @PathVariable Long planId) {
        return ResponseEntity.ok(ApiResponse.success(
                trainingPlanService.getResultsByPlan(planId)));
    }
}
