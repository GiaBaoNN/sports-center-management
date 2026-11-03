package com.scms.backend.service;

import com.scms.backend.dto.ClassRequest;
import com.scms.backend.dto.ScheduleRequest;
import com.scms.backend.entity.*;
import com.scms.backend.exception.*;
import com.scms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassService {

    private final ClassRepository classRepository;
    private final SportRepository sportRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final ClassRegistrationRepository registrationRepository;

    // ======================== CLASS CRUD ========================

    public List<ClassEntity> getAllClasses() {
        return classRepository.findByStatusNot(ClassEntity.Status.Cancelled);
    }

    public List<ClassEntity> getAllClassesIncludingCancelled() {
        return classRepository.findAll();
    }

    public ClassEntity getClassById(Integer id) {
        return classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class", "id", id));
    }

    public List<ClassEntity> getClassesByCoach(Integer coachId) {
        return classRepository.findByCoachUserId(coachId);
    }

    public List<ClassEntity> getClassesBySport(Integer sportId) {
        return classRepository.findBySportSportId(sportId);
    }

    @Transactional
    public ClassEntity createClass(ClassRequest request) {
        Sport sport = sportRepository.findById(request.sportId())
                .orElseThrow(() -> new ResourceNotFoundException("Sport", "id", request.sportId()));

        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.roomId()));

        User coach = userRepository.findById(request.coachId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.coachId()));

        if (coach.getRole() != User.Role.Coach) {
            throw new BadRequestException("User " + coach.getUserId() + " is not a Coach");
        }

        ClassEntity classEntity = ClassEntity.builder()
                .className(request.className())
                .sport(sport)
                .room(room)
                .coach(coach)
                .status(ClassEntity.Status.Upcoming)
                .build();

        return classRepository.save(classEntity);
    }

    @Transactional
    public ClassEntity updateClass(Integer id, ClassRequest request) {
        ClassEntity classEntity = getClassById(id);

        if (classEntity.getStatus() == ClassEntity.Status.Completed
                || classEntity.getStatus() == ClassEntity.Status.Cancelled) {
            throw new BadRequestException("Cannot update a " + classEntity.getStatus() + " class");
        }

        Sport sport = sportRepository.findById(request.sportId())
                .orElseThrow(() -> new ResourceNotFoundException("Sport", "id", request.sportId()));

        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.roomId()));

        User coach = userRepository.findById(request.coachId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.coachId()));

        if (coach.getRole() != User.Role.Coach) {
            throw new BadRequestException("User " + coach.getUserId() + " is not a Coach");
        }

        classEntity.setClassName(request.className());
        classEntity.setSport(sport);
        classEntity.setRoom(room);
        classEntity.setCoach(coach);

        return classRepository.save(classEntity);
    }

    @Transactional
    public ClassEntity updateClassStatus(Integer id, String newStatus) {
        ClassEntity classEntity = getClassById(id);
        ClassEntity.Status status;
        try {
            status = ClassEntity.Status.valueOf(newStatus);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + newStatus);
        }

        // Validate state transitions
        ClassEntity.Status current = classEntity.getStatus();
        boolean valid = switch (current) {
            case Upcoming -> status == ClassEntity.Status.Ongoing || status == ClassEntity.Status.Cancelled;
            case Ongoing -> status == ClassEntity.Status.Completed;
            default -> false;
        };

        if (!valid) {
            throw new BadRequestException("Cannot transition from " + current + " to " + status);
        }

        classEntity.setStatus(status);
        return classRepository.save(classEntity);
    }

    // ======================== SCHEDULE ========================

    public List<Schedule> getSchedulesByClass(Integer classId) {
        return scheduleRepository.findByClassEntityClassId(classId);
    }

    public List<Schedule> getSchedulesByDateRange(LocalDate start, LocalDate end) {
        return scheduleRepository.findByClassDateBetween(start, end);
    }

    public Schedule getScheduleById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", id));
    }

    @Transactional
    public Schedule createSchedule(ScheduleRequest request) {
        ClassEntity classEntity = getClassById(request.classId());

        if (classEntity.getStatus() == ClassEntity.Status.Cancelled
                || classEntity.getStatus() == ClassEntity.Status.Completed) {
            throw new BadRequestException("Cannot add schedule to a "
                    + classEntity.getStatus() + " class");
        }

        if (request.endDatetime().isBefore(request.startDatetime())
                || request.endDatetime().isEqual(request.startDatetime())) {
            throw new BadRequestException("End time must be after start time");
        }

        if (!request.classDate().equals(request.startDatetime().toLocalDate())) {
            throw new BadRequestException("Class date must match start datetime date");
        }

        // Check room overlap
        List<Schedule> overlapping = scheduleRepository.findOverlappingSchedules(
                classEntity.getRoom().getRoomId(),
                request.startDatetime(),
                request.endDatetime());

        if (!overlapping.isEmpty()) {
            throw new BadRequestException("Room is already booked during this time slot");
        }

        Schedule schedule = Schedule.builder()
                .classEntity(classEntity)
                .classDate(request.classDate())
                .startDatetime(request.startDatetime())
                .endDatetime(request.endDatetime())
                .build();

        return scheduleRepository.save(schedule);
    }

    // ======================== REGISTRATION ========================

    @Transactional
    public ClassRegistration registerForClass(Integer classId, Integer memberId) {
        ClassEntity classEntity = getClassById(classId);

        if (classEntity.getStatus() != ClassEntity.Status.Upcoming
                && classEntity.getStatus() != ClassEntity.Status.Ongoing) {
            throw new BadRequestException("Cannot register for a " + classEntity.getStatus() + " class");
        }

        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", memberId));

        if (member.getRole() != User.Role.Member) {
            throw new BadRequestException("Only members can register for classes");
        }

        // Check not already registered
        registrationRepository.findByClassEntityClassIdAndMemberUserIdAndStatus(
                classId, memberId, ClassRegistration.Status.Registered)
                .ifPresent(r -> {
                    throw new BadRequestException("Already registered for this class");
                });

        // Check capacity
        long registered = registrationRepository.countByClassEntityClassIdAndStatus(
                classId, ClassRegistration.Status.Registered);
        int capacity = classEntity.getRoom().getMaxCapacity();

        if (registered >= capacity) {
            throw new BadRequestException("Class is full (capacity: " + capacity + ")");
        }

        ClassRegistration registration = ClassRegistration.builder()
                .classEntity(classEntity)
                .member(member)
                .status(ClassRegistration.Status.Registered)
                .build();

        return registrationRepository.save(registration);
    }

    @Transactional
    public ClassRegistration cancelRegistration(Long registrationId, Integer memberId) {
        ClassRegistration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("ClassRegistration", "id", registrationId));

        if (!reg.getMember().getUserId().equals(memberId)) {
            throw new BadRequestException("You can only cancel your own registration");
        }

        if (reg.getStatus() != ClassRegistration.Status.Registered) {
            throw new BadRequestException("Registration is already cancelled");
        }

        reg.setStatus(ClassRegistration.Status.Cancelled);
        return registrationRepository.save(reg);
    }

    public List<ClassRegistration> getRegistrationsByClass(Integer classId) {
        return registrationRepository.findByClassEntityClassIdAndStatus(
                classId, ClassRegistration.Status.Registered);
    }

    public List<ClassRegistration> getRegistrationsByMember(Integer memberId) {
        return registrationRepository.findByMemberUserId(memberId);
    }
}
