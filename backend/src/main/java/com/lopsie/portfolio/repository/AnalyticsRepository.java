package com.lopsie.portfolio.repository;

import com.lopsie.portfolio.entity.AnalyticsEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<AnalyticsEvent, Long> {
    long countByTargetUserIdAndEventType(Long targetUserId, String eventType);

    // For time-series charts (e.g., views in the last 7 days)
    List<AnalyticsEvent> findByTargetUserIdAndTimestampAfter(Long targetUserId, LocalDateTime timestamp);
}
