package com.lopsie.portfolio.service;

import com.lopsie.portfolio.entity.Resume;
import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.repository.ResumeRepository;
import com.lopsie.portfolio.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ResumeService {
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    public Resume saveResume(Long userId, String rawText) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Resume resume = new Resume();
        resume.setContent(rawText);
        resume.setUser(user);
        return resumeRepository.save(resume);
    }
}
