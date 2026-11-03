package com.scms.backend.repository;

import com.scms.backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByScheduleScheduleId(Long scheduleId);

    List<Attendance> findByRegistrationRegistrationId(Long registrationId);

    Optional<Attendance> findByScheduleScheduleIdAndRegistrationRegistrationId(Long scheduleId, Long registrationId);
}
