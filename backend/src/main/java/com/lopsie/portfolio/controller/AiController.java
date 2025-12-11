package com.lopsie.portfolio.controller;

import com.lopsie.portfolio.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AIService aiService;

    public AiController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/regenerate")
    public ResponseEntity<?> regenerateSection(@RequestBody Map<String, String> payload) {
        String sectionType = payload.get("sectionType");
        String currentContent = payload.get("currentContent");
        String instructions = payload.get("instructions");

        if (sectionType == null || currentContent == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "sectionType and currentContent are required."));
        }

        try {
            String newContent = aiService.regenerateSection(sectionType, currentContent, instructions);
            return ResponseEntity.ok(Map.of("newContent", newContent));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "AI generation failed: " + e.getMessage()));
        }
    }
}
