package com.scms.backend.repository;

import com.scms.backend.entity.MembershipPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipPackageRepository extends JpaRepository<MembershipPackage, Integer> {

    List<MembershipPackage> findByIsActiveTrue();

    Optional<MembershipPackage> findByName(String name);

    boolean existsByName(String name);
}
