package com.lopsie.portfolio.service;

import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder; // <-- Import
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService { // <-- IMPLEMENT UserDetailsService

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // <-- Inject PasswordEncoder
    private final OtpService otpService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, OtpService otpService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.otpService = otpService;
}

    /**
     * This method is used by Spring Security to load a user for authentication.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    /**
     * The new registration method with password hashing and validation.
     */
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already in use.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(false); // important: keep user disabled until OTP verified
        User saved = userRepository.save(user);

        // generate + send OTP
        otpService.generateAndSendOtp(saved.getEmail());

        return saved;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}