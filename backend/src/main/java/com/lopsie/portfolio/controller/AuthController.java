package com.lopsie.portfolio.controller;

import com.lopsie.portfolio.dto.AuthResponse;
import com.lopsie.portfolio.dto.LoginRequest;
import com.lopsie.portfolio.dto.RegisterRequest;
import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.service.JwtService;
import com.lopsie.portfolio.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserService userService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User newUser = new User();
            newUser.setName(registerRequest.getName());
            newUser.setEmail(registerRequest.getEmail());
            newUser.setPassword(registerRequest.getPassword());
            userService.registerUser(newUser);
            return ResponseEntity.ok(Map.of("message", "Registration successful! An OTP has been sent to your email."));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (DisabledException e) {
            // This specifically catches the error for users who are not yet verified.
            return ResponseEntity.status(401).body(Map.of("message", "Account not verified. Please check your email for an OTP."));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password."));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");
        boolean isVerified = userService.verifyUser(email, code);

        if (isVerified) {
            return ResponseEntity.ok(Map.of("message", "User verified successfully! You can now log in."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid verification code."));
        }
    }
}