package com.scms.backend.controller;

import com.scms.backend.dto.ApiResponse;
import com.scms.backend.entity.MembershipPackage;
import com.scms.backend.service.MembershipPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class PackageController {

    private final MembershipPackageService packageService;

    /** Public: get all active packages for member browsing */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MembershipPackage>>> getActivePackages() {
        return ResponseEntity.ok(ApiResponse.success(packageService.getAllActivePackages()));
    }

    /** Get a specific package */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MembershipPackage>> getPackage(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(packageService.getPackageById(id)));
    }
}
