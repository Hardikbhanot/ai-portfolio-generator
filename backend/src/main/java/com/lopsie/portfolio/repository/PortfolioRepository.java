package com.lopsie.portfolio.repository;

import com.lopsie.portfolio.entity.Portfolio;
import com.lopsie.portfolio.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByUser(User user);

    // Find the latest portfolio for a user (simplest way to get 'the' portfolio)
    Optional<Portfolio> findTopByUserOrderByIdDesc(User user);
}
