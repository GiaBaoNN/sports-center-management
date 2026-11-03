package com.scms.backend.controller;

import com.scms.backend.dto.ApiResponse;
import com.scms.backend.entity.*;
import com.scms.backend.security.UserDetailsImpl;
import com.scms.backend.service.ClassService;
import com.scms.backend.service.SportRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;
    private final SportRoomService sportRoomService;

    /** Public: browse all classes */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ClassEntity>>> getAllClasses() {
        return ResponseEntity.ok(ApiResponse.success(classService.getAllClasses()));
    }

    /** Public: get class detail */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassEntity>> getClassById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(classService.getClassById(id)));
    }

    /** Public: get schedules for a class */
    @GetMapping("/{id}/schedules")
    public ResponseEntity<ApiResponse<List<Schedule>>> getClassSchedules(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(classService.getSchedulesByClass(id)));
    }

    /** Public: get schedules in a date range */
    @GetMapping("/schedules")
    public ResponseEntity<ApiResponse<List<Schedule>>> getSchedulesByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(ApiResponse.success(classService.getSchedulesByDateRange(start, end)));
    }

    /** Member: register for a class */
    @PostMapping("/{classId}/register")
    public ResponseEntity<ApiResponse<ClassRegistration>> registerForClass(
            @PathVariable Integer classId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        ClassRegistration reg = classService.registerForClass(classId, principal.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Registered for class", reg));
    }

    /** Member: cancel registration */
    @PutMapping("/registrations/{registrationId}/cancel")
    public ResponseEntity<ApiResponse<ClassRegistration>> cancelRegistration(
            @PathVariable Long registrationId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        ClassRegistration reg = classService.cancelRegistration(registrationId, principal.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Registration cancelled", reg));
    }

    /** Member: view my registrations */
    @GetMapping("/my/registrations")
    public ResponseEntity<ApiResponse<List<ClassRegistration>>> getMyRegistrations(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(ApiResponse.success(
                classService.getRegistrationsByMember(principal.getUserId())));
    }

    /** Public: get registered members for a class */
    @GetMapping("/{classId}/registrations")
    public ResponseEntity<ApiResponse<List<ClassRegistration>>> getClassRegistrations(
            @PathVariable Integer classId) {
        return ResponseEntity.ok(ApiResponse.success(
                classService.getRegistrationsByClass(classId)));
    }

    /** Public: browse all sports */
    @GetMapping("/sports")
    public ResponseEntity<ApiResponse<List<Sport>>> getAllSports() {
        return ResponseEntity.ok(ApiResponse.success(sportRoomService.getAllSports()));
    }
}
