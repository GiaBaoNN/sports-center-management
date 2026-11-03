package com.scms.backend.repository;

import com.scms.backend.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {

    List<Membership> findByUserUserId(Integer userId);

    Optional<Membership> findByUserUserIdAndStatus(Integer userId, Membership.Status status);

    List<Membership> findByStatus(Membership.Status status);

    @Query("SELECT m FROM Membership m WHERE m.status = 'Active' AND m.endDate < :date")
    List<Membership> findExpiredActiveMemberships(@Param("date") LocalDate date);
}
