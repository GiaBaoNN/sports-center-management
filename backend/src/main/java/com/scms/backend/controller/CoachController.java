package com.scms.backend.controller;

import com.scms.backend.dto.ApiResponse;
import com.scms.backend.entity.*;
import com.scms.backend.security.UserDetailsImpl;
import com.scms.backend.service.AttendanceService;
import com.scms.backend.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Coach endpoints for teaching schedule and attendance management.
 */
@RestController
@RequestMapping("/api/coach")
@PreAuthorize("hasRole('Coach')")
@RequiredArgsConstructor
public class CoachController {

    private final ClassService classService;
    private final AttendanceService attendanceService;

    /** View my assigned classes */
    @GetMapping("/classes")
    public ResponseEntity<ApiResponse<List<ClassEntity>>> getMyClasses(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(ApiResponse.success(
                classService.getClassesByCoach(principal.getUserId())));
    }

    /** View schedules for one of my classes */
    @GetMapping("/classes/{classId}/schedules")
    public ResponseEntity<ApiResponse<List<Schedule>>> getClassSchedules(
            @PathVariable Integer classId) {
        return ResponseEntity.ok(ApiResponse.success(
                classService.getSchedulesByClass(classId)));
    }

    /** View registered members for a class */
    @GetMapping("/classes/{classId}/members")
    public ResponseEntity<ApiResponse<List<ClassRegistration>>> getClassMembers(
            @PathVariable Integer classId) {
        return ResponseEntity.ok(ApiResponse.success(
                classService.getRegistrationsByClass(classId)));
    }

    /** Record attendance for a schedule session */
    @PostMapping("/attendance")
    public ResponseEntity<ApiResponse<Attendance>> recordAttendance(
            @RequestParam Long scheduleId,
            @RequestParam Long registrationId,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        Attendance attendance = attendanceService.recordAttendance(
                scheduleId, registrationId, status, notes);
        return ResponseEntity.ok(ApiResponse.success("Attendance recorded", attendance));
    }

    /** Update an existing attendance record */
    @PutMapping("/attendance/{id}")
    public ResponseEntity<ApiResponse<Attendance>> updateAttendance(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(ApiResponse.success(
                attendanceService.updateAttendance(id, status, notes)));
    }

    /** View attendance for a schedule session */
    @GetMapping("/attendance/schedule/{scheduleId}")
    public ResponseEntity<ApiResponse<List<Attendance>>> getAttendanceBySchedule(
            @PathVariable Long scheduleId) {
        return ResponseEntity.ok(ApiResponse.success(
                attendanceService.getAttendanceBySchedule(scheduleId)));
    }
}
