package com.lopsie.portfolio.controller;

import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/subdomain")
    public ResponseEntity<?> updateSubdomain(@RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetails userDetails) {
        String subdomain = payload.get("subdomain");
        if (subdomain == null || subdomain.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Subdomain cannot be empty");
        }

        try {
            User updatedUser = userService.updateSubdomain(userDetails.getUsername(), subdomain);
            return ResponseEntity
                    .ok(Map.of("message", "Subdomain updated successfully", "subdomain", updatedUser.getSubdomain()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update subdomain");
        }
    }
}
