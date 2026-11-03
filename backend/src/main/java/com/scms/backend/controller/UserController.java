package com.scms.backend.controller;

import com.scms.backend.dto.*;
import com.scms.backend.entity.User;
import com.scms.backend.security.UserDetailsImpl;
import com.scms.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** Get current user's profile */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getMyProfile(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        User user = userService.getUserById(principal.getUserId());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    /** Update current user's profile */
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<User>> updateMyProfile(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody UserUpdateRequest request) {
        User user = userService.updateUser(principal.getUserId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", user));
    }

    /** Change password */
    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getUserId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed", null));
    }
}
