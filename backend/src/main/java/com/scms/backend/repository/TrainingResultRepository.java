package com.scms.backend.repository;

import com.scms.backend.entity.TrainingResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingResultRepository extends JpaRepository<TrainingResult, Long> {

    List<TrainingResult> findByMemberUserId(Integer memberId);

    @Query("SELECT tr FROM TrainingResult tr WHERE tr.trainingPlan.planId = :planId")
    List<TrainingResult> findByPlanPlanId(@Param("planId") Long planId);

    List<TrainingResult> findByTrainingPlanPlanId(Long planId);

    List<TrainingResult> findByCoachUserId(Integer coachId);
}
