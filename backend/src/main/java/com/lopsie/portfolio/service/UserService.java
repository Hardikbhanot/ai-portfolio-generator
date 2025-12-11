package com.lopsie.portfolio.service;

import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.repository.UserRepository;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = findByEmail(email);
        if (!user.isEnabled()) {
            throw new DisabledException("User account is not yet verified.");
        }
        return user;
    }

    /**
     * Handles new user registration. It hashes the password, generates an OTP,
     * saves the user as 'unverified' (enabled=false), and sends a verification
     * email.
     */
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("An account with this email already exists.");
        }
        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Generate a 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setVerificationCode(otp);

        // Explicitly set the user as not enabled before saving.
        user.setEnabled(false);

        // --- NEW DEBUGGING LOG ---
        // This will show us the state of the user object right before it's saved.
        System.out.println("--- Registering New User ---");
        System.out.println("Saving user: " + user.getEmail());
        System.out.println("  - Is Enabled? " + user.isEnabled());
        System.out.println("  - Verification Code: " + user.getVerificationCode());

        User savedUser = userRepository.save(user);

        // Send the verification email
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), otp);

        return savedUser;
    }

    /**
     * Verifies a user's account by checking the provided OTP.
     * This version includes detailed logging to debug the process.
     */
    public boolean verifyUser(String email, String code) {
        // --- DEBUGGING LOG 1: Check if the method is being called ---
        System.out.println("--- Starting OTP Verification ---");
        System.out.println("Attempting to verify user with email: " + email + " and code: " + code);

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // --- DEBUGGING LOG 2: Check if the user was found ---
            System.out.println("VERIFICATION FAILED: User with email " + email + " was not found in the database.");
            return false;
        }

        // --- DEBUGGING LOG 3: Log the state of the user found in the DB ---
        System.out.println("User found in DB: " + user.getEmail());
        System.out.println("  - Is Enabled? " + user.isEnabled());

        // FIX: If user is already enabled, consider it a success (idempotency)
        if (user.isEnabled()) {
            System.out.println("VERIFICATION SUCCESS: User is already enabled.");
            return true;
        }

        System.out.println("  - Stored OTP: " + user.getVerificationCode());

        // --- DEBUGGING LOG 4: Check each condition individually ---
        boolean codeExists = user.getVerificationCode() != null;
        boolean codesMatch = codeExists && user.getVerificationCode().equals(code);

        System.out.println("Condition Checks:");
        System.out.println("  - Does a verification code exist? -> " + codeExists);
        System.out.println("  - Do the provided and stored codes match? -> " + codesMatch);

        if (codeExists && codesMatch) {
            System.out.println("VERIFICATION SUCCESS: All conditions met. Enabling user.");
            user.setEnabled(true);
            user.setVerificationCode(null);
            userRepository.save(user);
            return true;
        } else {
            System.out.println("VERIFICATION FAILED: Invalid OTP.");
            return false;
        }
    }

    /**
     * A helper method to find a user by their email.
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    /**
     * Initiates the password reset process by generating an OTP and sending an
     * email.
     */
    public void initiatePasswordReset(String email) {
        User user = findByEmail(email); // Will throw exception if not found

        // Generate a 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setVerificationCode(otp);
        userRepository.save(user);

        // Send the reset email
        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), otp);
    }

    /**
     * Resets the user's password if the provided OTP is valid.
     */
    public boolean resetPassword(String email, String otp, String newPassword) {
        User user = findByEmail(email);

        if (user.getVerificationCode() != null && user.getVerificationCode().equals(otp)) {
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setVerificationCode(null); // Clear the OTP after usage
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public User updateSubdomain(String email, String subdomain) {
        // Basic validation regex for subdomain
        if (!subdomain.matches("^[a-z0-9-]+$")) {
            throw new IllegalArgumentException("Subdomain can only contain lowercase letters, numbers, and hyphens.");
        }

        // Check if subdomain is taken
        if (userRepository.findBySubdomain(subdomain).isPresent()) {
            // Check if it belongs to someone else
            User owner = userRepository.findBySubdomain(subdomain).get();
            if (!owner.getEmail().equals(email)) {
                throw new IllegalArgumentException("Subdomain is already taken.");
            }
        }

        User user = findByEmail(email);
        user.setSubdomain(subdomain);
        return userRepository.save(user);
    }
}
