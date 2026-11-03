package com.scms.backend.repository;

import com.scms.backend.entity.TrainingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingPlanRepository extends JpaRepository<TrainingPlan, Long> {

    List<TrainingPlan> findByCoachUserId(Integer coachId);

    List<TrainingPlan> findByMemberUserId(Integer memberId);

    List<TrainingPlan> findByClassEntityClassId(Integer classId);
}
