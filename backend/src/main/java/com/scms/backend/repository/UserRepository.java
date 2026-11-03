package com.scms.backend.repository;

import com.scms.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByPhone(String phone);

    Optional<User> findByUsername(String username);

    List<User> findByRole(User.Role role);

    List<User> findByIsActiveTrue();

    boolean existsByPhone(String phone);

    boolean existsByUsername(String username);
}
