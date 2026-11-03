package com.scms.backend.repository;

import com.scms.backend.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByClassEntityClassId(Integer classId);

    List<Schedule> findByClassDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT s FROM Schedule s JOIN s.classEntity c JOIN c.room r WHERE r.roomId = :roomId AND s.startDatetime < :endTime AND s.endDatetime > :startTime AND c.status <> 'Cancelled'")
    List<Schedule> findOverlappingSchedules(@Param("roomId") Integer roomId,
                                           @Param("startTime") LocalDateTime startTime,
                                           @Param("endTime") LocalDateTime endTime);
}
