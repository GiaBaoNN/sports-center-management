package com.scms.backend.service;

import com.scms.backend.entity.AuditLog;
import com.scms.backend.entity.User;
import com.scms.backend.repository.AuditLogRepository;
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
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public Page<AuditLog> getAllAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public List<AuditLog> getLogsByActor(Integer actorUserId) {
        return auditLogRepository.findByActorUserIdOrderByCreatedAtDesc(actorUserId);
    }

    @Transactional
    public AuditLog log(Integer actorUserId, String actionType, String entityName,
                        String entityId, String details) {
        User actor = null;
        if (actorUserId != null) {
            actor = userRepository.findById(actorUserId).orElse(null);
        }

        AuditLog log = AuditLog.builder()
                .actorUser(actor)
                .actionType(actionType)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .createdAt(LocalDateTime.now())
                .build();

        return auditLogRepository.save(log);
    }
}
