package com.lopsie.portfolio.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String to, String name, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // IMPORTANT: Replace with your "from" email and a desired sender name
            helper.setFrom("hardikbhanot123@gmail.com", "Lopsie Portfolio");
            helper.setTo(to);
            helper.setSubject("Verify Your Email Address for Lopsie Portfolio");

            // A simple, clean HTML template for the email
            String htmlContent = "<h3>Hello, " + name + "!</h3>"
                    + "<p>Thank you for registering. Please use the 6-digit code below to verify your account:</p>"
                    + "<h2 style='color: #4f46e5; letter-spacing: 2px;'><b>" + code + "</b></h2>"
                    + "<p>This code will expire in 15 minutes.</p>"
                    + "<br>"
                    + "<p>If you did not register for an account, please ignore this email.</p>";

            helper.setText(htmlContent, true); // true indicates the content is HTML
            mailSender.send(message);

        } catch (Exception e) {
            // In a production app, you would have more robust error logging here
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public void sendPasswordResetEmail(String to, String name, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("hardikbhanot123@gmail.com", "Lopsie Portfolio");
            helper.setTo(to);
            helper.setSubject("Reset Your Password - Lopsie Portfolio");

            String htmlContent = "<h3>Hello, " + name + "!</h3>"
                    + "<p>You requested to reset your password. Use the code below to proceed:</p>"
                    + "<h2 style='color: #4f46e5; letter-spacing: 2px;'><b>" + code + "</b></h2>"
                    + "<p>This code will expire in 15 minutes.</p>"
                    + "<br>"
                    + "<p>If you did not request a password reset, you can safely ignore this email.</p>";

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
}
