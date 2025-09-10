package com.lopsie.portfolio.controller;

import com.lopsie.portfolio.entity.Resume;
import com.lopsie.portfolio.service.ResumeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:3000")
public class ResumeController {
    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    // Upload resume for a user
    @PostMapping("/{userId}")
    public Resume uploadResume(@PathVariable Long userId, @RequestBody String rawText) {
        return resumeService.saveResume(userId, rawText);
    }
}
