package com.lopsie.portfolio.service;

import com.lopsie.portfolio.entity.Otp;
import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.repository.OtpRepository;
import com.lopsie.portfolio.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(OtpRepository otpRepository, EmailService emailService, UserRepository userRepository) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    public void generateAndSendOtp(String email) {
        // remove existing
        otpRepository.deleteByEmail(email);

        int code = secureRandom.nextInt(900_000) + 100_000; // ensures 6 digits
        String otpCode = String.format("%06d", code);
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        Otp otp = new Otp(email, otpCode, expiry);
        otpRepository.save(otp);

        emailService.sendOtpEmail(email, otpCode);
    }

    @Transactional
    public boolean verifyOtpAndActivate(String email, String code) {
        Optional<Otp> rec = otpRepository.findByEmailAndCode(email, code);
        if (rec.isEmpty()) return false;
        Otp otp = rec.get();
        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpRepository.deleteByEmail(email);
            return false;
        }
        // activate user
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalStateException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);

        // delete used otp
        otpRepository.deleteByEmail(email);
        return true;
    }

    // Optional cleanup method (can be scheduled)
    public void deleteExpiredOtps() {
        otpRepository.findAll()
                .stream()
                .filter(o -> o.getExpiryTime().isBefore(LocalDateTime.now()))
                .forEach(o -> otpRepository.delete(o));
    }
}
