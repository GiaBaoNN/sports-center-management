package com.scms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ClassRegistrations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClassRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registration_id")
    private Long registrationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    @Column(name = "registration_date", nullable = false)
    private LocalDateTime registrationDate;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status = Status.Registered;

    @PrePersist
    private void prePersist() {
        if (registrationDate == null) registrationDate = LocalDateTime.now();
    }

    public enum Status {
        Registered, Cancelled
    }
}
