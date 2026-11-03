package com.scms.backend.repository;

import com.scms.backend.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.actorUser.userId = :actorUserId ORDER BY a.createdAt DESC")
    List<AuditLog> findByActorUserIdOrderByCreatedAtDesc(@Param("actorUserId") Integer actorUserId);

    List<AuditLog> findByActorUserUserIdOrderByCreatedAtDesc(Integer actorUserId);
}
