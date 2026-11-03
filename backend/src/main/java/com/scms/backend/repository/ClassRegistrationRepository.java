package com.scms.backend.repository;

import com.scms.backend.entity.ClassRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRegistrationRepository extends JpaRepository<ClassRegistration, Long> {

    List<ClassRegistration> findByClassEntityClassIdAndStatus(Integer classId, ClassRegistration.Status status);

    List<ClassRegistration> findByMemberUserIdAndStatus(Integer memberId, ClassRegistration.Status status);

    Optional<ClassRegistration> findByClassEntityClassIdAndMemberUserIdAndStatus(Integer classId, Integer memberId, ClassRegistration.Status status);

    long countByClassEntityClassIdAndStatus(Integer classId, ClassRegistration.Status status);

    List<ClassRegistration> findByMemberUserId(Integer memberId);
}
