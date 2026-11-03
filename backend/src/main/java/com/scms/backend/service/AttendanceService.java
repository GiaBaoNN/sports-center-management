package com.scms.backend.service;

import com.scms.backend.entity.*;
import com.scms.backend.exception.*;
import com.scms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final ScheduleRepository scheduleRepository;
    private final ClassRegistrationRepository registrationRepository;

    public List<Attendance> getAttendanceBySchedule(Long scheduleId) {
        return attendanceRepository.findByScheduleScheduleId(scheduleId);
    }

    public List<Attendance> getAttendanceByRegistration(Long registrationId) {
        return attendanceRepository.findByRegistrationRegistrationId(registrationId);
    }

    @Transactional
    public Attendance recordAttendance(Long scheduleId, Long registrationId, String status, String notes) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", scheduleId));

        ClassRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("ClassRegistration", "id", registrationId));

        // Validate same class
        if (!schedule.getClassEntity().getClassId().equals(registration.getClassEntity().getClassId())) {
            throw new BadRequestException("Schedule and registration belong to different classes");
        }

        if (registration.getStatus() != ClassRegistration.Status.Registered) {
            throw new BadRequestException("Cannot record attendance for a cancelled registration");
        }

        // Check duplicate
        attendanceRepository.findByScheduleScheduleIdAndRegistrationRegistrationId(scheduleId, registrationId)
                .ifPresent(a -> {
                    throw new BadRequestException("Attendance already recorded for this schedule and registration");
                });

        Attendance.Status attendanceStatus;
        try {
            attendanceStatus = Attendance.Status.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid attendance status: " + status);
        }

        Attendance attendance = Attendance.builder()
                .schedule(schedule)
                .registration(registration)
                .status(attendanceStatus)
                .notes(notes)
                .build();

        return attendanceRepository.save(attendance);
    }

    @Transactional
    public Attendance updateAttendance(Long attendanceId, String status, String notes) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance", "id", attendanceId));

        Attendance.Status attendanceStatus;
        try {
            attendanceStatus = Attendance.Status.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid attendance status: " + status);
        }

        attendance.setStatus(attendanceStatus);
        attendance.setNotes(notes);

        return attendanceRepository.save(attendance);
    }
}
