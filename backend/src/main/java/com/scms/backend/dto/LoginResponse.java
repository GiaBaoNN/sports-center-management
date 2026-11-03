package com.scms.backend.dto;

public record LoginResponse(
        String token,
        String tokenType,
        Integer userId,
        String username,
        String fullName,
        String phone,
        String email,
        String role
) {
    public LoginResponse(String token, Integer userId, String username,
                         String fullName, String phone, String email, String role) {
        this(token, "Bearer", userId, username, fullName, phone, email, role);
    }
}
