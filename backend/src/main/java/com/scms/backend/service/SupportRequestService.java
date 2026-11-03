package com.scms.backend.service;

import com.scms.backend.dto.SupportRequestDto;
import com.scms.backend.dto.SupportResolveRequest;
import com.scms.backend.entity.SupportRequest;
import com.scms.backend.entity.User;
import com.scms.backend.exception.BadRequestException;
import com.scms.backend.exception.ResourceNotFoundException;
import com.scms.backend.repository.SupportRequestRepository;
import com.scms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportRequestService {

    private final SupportRequestRepository supportRequestRepository;
    private final UserRepository userRepository;

    public List<SupportRequest> getRequestsByMember(Integer memberId) {
        return supportRequestRepository.findByMemberUserIdOrderByCreatedAtDesc(memberId);
    }

    public List<SupportRequest> getRequestsByStatus(String statusStr) {
        SupportRequest.Status status;
        try {
            status = SupportRequest.Status.valueOf(statusStr);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + statusStr);
        }
        return supportRequestRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Page<SupportRequest> getAllRequests(Pageable pageable) {
        return supportRequestRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public SupportRequest getRequestById(Long id) {
        return supportRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SupportRequest", "id", id));
    }

    @Transactional
    public SupportRequest createRequest(Integer memberId, SupportRequestDto dto) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", memberId));

        SupportRequest request = SupportRequest.builder()
                .member(member)
                .subject(dto.subject())
                .description(dto.description())
                .status(SupportRequest.Status.Open)
                .createdAt(LocalDateTime.now())
                .build();

        return supportRequestRepository.save(request);
    }

    @Transactional
    public SupportRequest updateStatus(Long requestId, Integer staffId, SupportResolveRequest dto) {
        SupportRequest request = getRequestById(requestId);

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", staffId));

        SupportRequest.Status newStatus;
        try {
            newStatus = SupportRequest.Status.valueOf(dto.status());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + dto.status());
        }

        request.setStatus(newStatus);
        request.setReceivedBy(staff);
        request.setUpdatedAt(LocalDateTime.now());
        if (dto.resolution() != null) {
            request.setResolution(dto.resolution());
        }

        return supportRequestRepository.save(request);
    }
}
