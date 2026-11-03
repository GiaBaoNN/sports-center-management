package com.scms.backend.controller;

import com.scms.backend.dto.*;
import com.scms.backend.entity.*;
import com.scms.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Manager-only endpoints for system administration.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('Manager')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final MembershipPackageService packageService;
    private final MembershipService membershipService;
    private final ClassService classService;
    private final SportRoomService sportRoomService;

    // ======================== USER MANAGEMENT ========================

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByRole(@PathVariable String role) {
        User.Role r = User.Role.valueOf(role);
        return ResponseEntity.ok(ApiResponse.success(userService.getUsersByRole(r)));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<User>> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.ok(ApiResponse.success("User created", user));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUser(id, request)));
    }

    @PutMapping("/users/{id}/toggle-active")
    public ResponseEntity<ApiResponse<User>> toggleUserActive(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(userService.toggleActive(id)));
    }

    // ======================== PACKAGE MANAGEMENT ========================

    @GetMapping("/packages")
    public ResponseEntity<ApiResponse<List<MembershipPackage>>> getAllPackages() {
        return ResponseEntity.ok(ApiResponse.success(packageService.getAllPackages()));
    }

    @PostMapping("/packages")
    public ResponseEntity<ApiResponse<MembershipPackage>> createPackage(
            @Valid @RequestBody PackageRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Package created",
                packageService.createPackage(request)));
    }

    @PutMapping("/packages/{id}")
    public ResponseEntity<ApiResponse<MembershipPackage>> updatePackage(
            @PathVariable Integer id,
            @Valid @RequestBody PackageRequest request) {
        return ResponseEntity.ok(ApiResponse.success(packageService.updatePackage(id, request)));
    }

    @PutMapping("/packages/{id}/toggle-active")
    public ResponseEntity<ApiResponse<MembershipPackage>> togglePackageActive(
            @PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(packageService.toggleActive(id)));
    }

    // ======================== CLASS MANAGEMENT ========================

    @GetMapping("/classes")
    public ResponseEntity<ApiResponse<List<ClassEntity>>> getAllClassesAdmin() {
        return ResponseEntity.ok(ApiResponse.success(classService.getAllClassesIncludingCancelled()));
    }

    @PostMapping("/classes")
    public ResponseEntity<ApiResponse<ClassEntity>> createClass(
            @Valid @RequestBody ClassRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Class created",
                classService.createClass(request)));
    }

    @PutMapping("/classes/{id}")
    public ResponseEntity<ApiResponse<ClassEntity>> updateClass(
            @PathVariable Integer id,
            @Valid @RequestBody ClassRequest request) {
        return ResponseEntity.ok(ApiResponse.success(classService.updateClass(id, request)));
    }

    @PutMapping("/classes/{id}/status")
    public ResponseEntity<ApiResponse<ClassEntity>> updateClassStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(classService.updateClassStatus(id, status)));
    }

    @PostMapping("/schedules")
    public ResponseEntity<ApiResponse<Schedule>> createSchedule(
            @Valid @RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Schedule created",
                classService.createSchedule(request)));
    }

    // ======================== SPORT & ROOM MANAGEMENT ========================

    @PostMapping("/sports")
    public ResponseEntity<ApiResponse<Sport>> createSport(
            @RequestParam String name, @RequestParam(required = false) String description) {
        return ResponseEntity.ok(ApiResponse.success(sportRoomService.createSport(name, description)));
    }

    @PutMapping("/sports/{id}")
    public ResponseEntity<ApiResponse<Sport>> updateSport(
            @PathVariable Integer id,
            @RequestParam String name, @RequestParam(required = false) String description) {
        return ResponseEntity.ok(ApiResponse.success(sportRoomService.updateSport(id, name, description)));
    }

    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<List<Room>>> getAllRooms() {
        return ResponseEntity.ok(ApiResponse.success(sportRoomService.getAllRooms()));
    }

    @PostMapping("/rooms")
    public ResponseEntity<ApiResponse<Room>> createRoom(
            @RequestParam String roomName,
            @RequestParam Integer maxCapacity,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(ApiResponse.success(
                sportRoomService.createRoom(roomName, maxCapacity, location)));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<Room>> updateRoom(
            @PathVariable Integer id,
            @RequestParam String roomName,
            @RequestParam Integer maxCapacity,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(ApiResponse.success(
                sportRoomService.updateRoom(id, roomName, maxCapacity, location)));
    }

    // ======================== MEMBERSHIPS (all) ========================

    @GetMapping("/memberships")
    public ResponseEntity<ApiResponse<List<Membership>>> getAllMemberships() {
        return ResponseEntity.ok(ApiResponse.success(membershipService.getAllMemberships()));
    }

    @GetMapping("/memberships/user/{userId}")
    public ResponseEntity<ApiResponse<List<Membership>>> getMembershipsByUser(
            @PathVariable Integer userId) {
        return ResponseEntity.ok(ApiResponse.success(
                membershipService.getMembershipsByUser(userId)));
    }
}
