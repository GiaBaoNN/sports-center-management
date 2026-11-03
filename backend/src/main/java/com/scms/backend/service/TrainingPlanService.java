package com.scms.backend.service;

import com.scms.backend.dto.TrainingPlanRequest;
import com.scms.backend.dto.TrainingResultRequest;
import com.scms.backend.entity.*;
import com.scms.backend.exception.BadRequestException;
import com.scms.backend.exception.ResourceNotFoundException;
import com.scms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainingPlanService {

    private final TrainingPlanRepository planRepository;
    private final TrainingResultRepository resultRepository;
    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final ScheduleRepository scheduleRepository;

    public List<TrainingPlan> getPlansByCoach(Integer coachId) {
        return planRepository.findByCoachUserId(coachId);
    }

    public List<TrainingPlan> getPlansByMember(Integer memberId) {
        return planRepository.findByMemberUserId(memberId);
    }

    public List<TrainingPlan> getPlansByClass(Integer classId) {
        return planRepository.findByClassEntityClassId(classId);
    }

    public TrainingPlan getPlanById(Long planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("TrainingPlan", "id", planId));
    }

    @Transactional
    public TrainingPlan createPlan(Integer coachId, TrainingPlanRequest request) {
        User coach = userRepository.findById(coachId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", coachId));

        if (coach.getRole() != User.Role.Coach) {
            throw new BadRequestException("User " + coachId + " is not a Coach");
        }

        // Target check: either member or class, not both or neither
        if ((request.memberId() == null && request.classId() == null) ||
            (request.memberId() != null && request.classId() != null)) {
            throw new BadRequestException("Training plan must target either a member or a class, not both");
        }

        User member = null;
        if (request.memberId() != null) {
            member = userRepository.findById(request.memberId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.memberId()));
            if (member.getRole() != User.Role.Member) {
                throw new BadRequestException("Target user is not a Member");
            }
        }

        ClassEntity classEntity = null;
        if (request.classId() != null) {
            classEntity = classRepository.findById(request.classId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class", "id", request.classId()));
        }

        TrainingPlan plan = TrainingPlan.builder()
                .coach(coach)
                .member(member)
                .classEntity(classEntity)
                .goals(request.goals())
                .aiRecommendation(request.aiRecommendation())
                .createdDate(LocalDate.now())
                .build();

        return planRepository.save(plan);
    }

    @Transactional
    public TrainingPlan updatePlan(Long planId, Integer coachId, TrainingPlanRequest request) {
        TrainingPlan plan = getPlanById(planId);

        if (!plan.getCoach().getUserId().equals(coachId)) {
            throw new BadRequestException("You can only edit training plans created by yourself");
        }

        plan.setGoals(request.goals());
        if (request.aiRecommendation() != null) {
            plan.setAiRecommendation(request.aiRecommendation());
        }

        return planRepository.save(plan);
    }

    // ======================== TRAINING RESULTS ========================

    public List<TrainingResult> getResultsByMember(Integer memberId) {
        return resultRepository.findByMemberUserId(memberId);
    }

    public List<TrainingResult> getResultsByPlan(Long planId) {
        return resultRepository.findByPlanPlanId(planId);
    }

    @Transactional
    public TrainingResult recordResult(Integer coachId, TrainingResultRequest request) {
        User coach = userRepository.findById(coachId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", coachId));

        if (coach.getRole() != User.Role.Coach) {
            throw new BadRequestException("User " + coachId + " is not a Coach");
        }

        TrainingPlan plan = getPlanById(request.planId());

        User member = userRepository.findById(request.memberId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.memberId()));

        if (member.getRole() != User.Role.Member) {
            throw new BadRequestException("Target user is not a Member");
        }

        Schedule schedule = null;
        if (request.scheduleId() != null) {
            schedule = scheduleRepository.findById(request.scheduleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", request.scheduleId()));
        }

        TrainingResult result = TrainingResult.builder()
                .trainingPlan(plan)
                .schedule(schedule)
                .coach(coach)
                .member(member)
                .resultNotes(request.resultNotes())
                .progressComment(request.progressComment())
                .recordedAt(LocalDateTime.now())
                .build();

        return resultRepository.save(result);
    }
}
