package com.lopsie.portfolio.controller;

import com.lopsie.portfolio.dto.AuthResponse; // We will create this DTO
import com.lopsie.portfolio.dto.LoginRequest; // We will create this DTO
import com.lopsie.portfolio.dto.OtpRequest;
import com.lopsie.portfolio.dto.RegisterRequest; // We will create this DTO
import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.service.JwtService; // We will create this service
import com.lopsie.portfolio.service.OtpService;
import com.lopsie.portfolio.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // Standard endpoint for authentication
// @CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;

    public AuthController(UserService userService, JwtService jwtService, AuthenticationManager authenticationManager, OtpService otpService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.otpService = otpService;
    }

    /**
     * Endpoint for new user registration.
     * Uses the secure `registerUser` method with password hashing.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            // Map the request DTO to the User entity
            User newUser = new User();
            newUser.setName(registerRequest.getName());
            newUser.setEmail(registerRequest.getEmail());
            newUser.setPassword(registerRequest.getPassword()); // Plain text password here

            // The service will handle hashing and saving
            userService.registerUser(newUser);

            return ResponseEntity.ok("Registration successful. OTP sent to email.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint for user login.
     * Authenticates the user and returns a JWT token upon success.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        // Authenticate the user using Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        // If authentication is successful, generate a JWT token
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        // Return the token in the response
        return ResponseEntity.ok(new AuthResponse(token));
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpRequest req) {
        boolean ok = otpService.verifyOtpAndActivate(req.getEmail(), req.getOtp());
        if (ok) return ResponseEntity.ok("Account verified successfully.");
        else return ResponseEntity.badRequest().body("Invalid or expired OTP.");
    }

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello from a protected endpoint!";
    }
}