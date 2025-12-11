package com.lopsie.portfolio.controller;

import com.lopsie.portfolio.entity.AnalyticsEvent;
import com.lopsie.portfolio.repository.AnalyticsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.repository.UserRepository;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsRepository analyticsRepository;
    private final UserRepository userRepository;

    public AnalyticsController(AnalyticsRepository analyticsRepository, UserRepository userRepository) {
        this.analyticsRepository = analyticsRepository;
        this.userRepository = userRepository;
    }

    // Public endpoint to track events
    @PostMapping("/track")
    public ResponseEntity<?> trackEvent(@RequestBody Map<String, Object> payload) {
        try {
            Long targetUserId = Long.valueOf(payload.get("targetUserId").toString());
            String eventType = (String) payload.get("eventType");
            String metadata = (String) payload.getOrDefault("metadata", "");

            AnalyticsEvent event = new AnalyticsEvent();
            event.setTargetUserId(targetUserId);
            event.setEventType(eventType);
            event.setMetadata(metadata);

            analyticsRepository.save(event);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid payload");
        }
    }

    // Protected endpoint to get stats for the logged-in user
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Long userId = user.getId();

        long totalViews = analyticsRepository.countByTargetUserIdAndEventType(userId, "VIEW");

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalViews", totalViews);
        // Add more stats here as needed (e.g. clicks, time series)

        return ResponseEntity.ok(stats);
    }
}
