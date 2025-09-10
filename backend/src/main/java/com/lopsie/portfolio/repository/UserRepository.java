package com.lopsie.portfolio.repository;

import com.lopsie.portfolio.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // <-- Import Optional

public interface UserRepository extends JpaRepository<User, Long> {
    // Return an Optional<User> to handle 'not found' cases gracefully
    Optional<User> findByEmail(String email);
}