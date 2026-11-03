package com.scms.backend.service;

import com.scms.backend.dto.*;
import com.scms.backend.entity.User;
import com.scms.backend.exception.*;
import com.scms.backend.repository.UserRepository;
import com.scms.backend.security.JwtUtils;
import com.scms.backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.phone(), request.password()));

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String token = jwtUtils.generateToken(userDetails);

        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getUserId()));

        return new LoginResponse(token, user.getUserId(), user.getUsername(),
                user.getFullName(), user.getPhone(), user.getEmail(), user.getRole().name());
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByPhone(request.phone())) {
            throw new DuplicateResourceException("User", "phone", request.phone());
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("User", "username", request.username());
        }

        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .email(request.email())
                .phone(request.phone())
                .role(User.Role.Member)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        // Auto-login after registration
        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        String token = jwtUtils.generateToken(userDetails);

        return new LoginResponse(token, user.getUserId(), user.getUsername(),
                user.getFullName(), user.getPhone(), user.getEmail(), user.getRole().name());
    }
}
