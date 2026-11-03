package com.scms.backend.repository;

import com.scms.backend.entity.SupportRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {

    List<SupportRequest> findByMemberUserIdOrderByCreatedAtDesc(Integer memberId);

    List<SupportRequest> findByStatusOrderByCreatedAtDesc(SupportRequest.Status status);

    Page<SupportRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
