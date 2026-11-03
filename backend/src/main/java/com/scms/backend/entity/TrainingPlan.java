package com.scms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "TrainingPlans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Long planId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id", nullable = false)
    private User coach;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private User member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    @Column(name = "goals", nullable = false, length = 1000)
    private String goals;

    @Column(name = "ai_recommendation", length = 2000)
    private String aiRecommendation;

    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    @PrePersist
    private void prePersist() {
        if (createdDate == null) {
            createdDate = LocalDate.now();
        }
    }
}
