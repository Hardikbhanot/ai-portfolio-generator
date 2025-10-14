package com.lopsie.portfolio.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    public EmailService(JavaMailSender mailSender) { this.mailSender = mailSender; }

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your AI Portfolio - Registration OTP");
        message.setText("Your verification code is: " + otp + "\nIt will expire in 5 minutes.");
        mailSender.send(message);
    }
}