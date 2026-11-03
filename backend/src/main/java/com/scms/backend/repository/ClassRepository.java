package com.scms.backend.repository;

import com.scms.backend.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, Integer> {

    List<ClassEntity> findByCoachUserId(Integer coachId);

    List<ClassEntity> findBySportSportId(Integer sportId);

    List<ClassEntity> findByStatus(ClassEntity.Status status);

    List<ClassEntity> findByStatusNot(ClassEntity.Status status);
}
