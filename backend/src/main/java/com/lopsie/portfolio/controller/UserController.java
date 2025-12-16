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
    private final com.lopsie.portfolio.service.JwtService jwtService;

    public UserController(UserService userService, com.lopsie.portfolio.service.JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
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

            // Generate new token with updated claims
            java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
            extraClaims.put("userId", updatedUser.getId());
            extraClaims.put("name", updatedUser.getName());
            extraClaims.put("subdomain", updatedUser.getSubdomain());
            String newToken = jwtService.generateToken(extraClaims, updatedUser);

            return ResponseEntity
                    .ok(Map.of(
                            "message", "Subdomain updated successfully",
                            "subdomain", updatedUser.getSubdomain(),
                            "token", newToken));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update subdomain");
        }
    }
}
