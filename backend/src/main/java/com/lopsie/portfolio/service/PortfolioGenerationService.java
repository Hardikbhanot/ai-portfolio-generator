package com.lopsie.portfolio.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lopsie.portfolio.entity.Portfolio;
import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.repository.PortfolioRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class PortfolioGenerationService {

    private final AIService aiService;
    private final PortfolioRepository portfolioRepository;
    private final TemplateEngine templateEngine;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PortfolioGenerationService(AIService aiService, PortfolioRepository portfolioRepository, TemplateEngine templateEngine) {
        this.aiService = aiService;
        this.portfolioRepository = portfolioRepository;
        this.templateEngine = templateEngine;
    }

    /**
     * The main public method that orchestrates the entire portfolio generation and saving process.
     */
    public String generateAndSavePortfolio(MultipartFile file, String templateId, User user) throws Exception {
        // 1. Parse the uploaded file to get the raw text
        String resumeText = parseResumeFile(file);

        // 2. Create a detailed prompt and get the structured data from the AI service
        String prompt = getPortfolioPrompt(resumeText);
        String rawJsonResponse = aiService.generatePortfolioContent(prompt);
        String cleanedJsonResponse = cleanJsonResponse(rawJsonResponse);
        Map<String, Object> portfolioData = parseJsonResponse(cleanedJsonResponse);

        // 3. Create and save a new Portfolio entity to the database
        savePortfolio(portfolioData, user);

        // 4. Use Thymeleaf to generate the final HTML based on the chosen template
        Context context = new Context();
        context.setVariable("portfolio", portfolioData); // Pass the map directly to Thymeleaf
        String templateName = getTemplateNameById(templateId); // Helper to map ID to filename

        return templateEngine.process(templateName, context);
    }

    // --- Private Helper Methods (moved from the old controller) ---

    private String parseResumeFile(MultipartFile file) throws Exception {
        try (InputStream inputStream = file.getInputStream()) {
            String filename = file.getOriginalFilename();
            if (filename == null) throw new IllegalArgumentException("Invalid file.");

            if (filename.toLowerCase().endsWith(".pdf")) {
                PDDocument document = PDDocument.load(inputStream);
                PDFTextStripper stripper = new PDFTextStripper();
                String text = stripper.getText(document);
                document.close();
                return text;
            } else if (filename.toLowerCase().endsWith(".docx")) {
                XWPFDocument doc = new XWPFDocument(inputStream);
                // This logic for DOCX parsing is more robust
                StringBuilder text = new StringBuilder();
                doc.getParagraphs().forEach(p -> text.append(p.getText()).append("\n"));
                doc.close();
                return text.toString();
            } else {
                throw new IllegalArgumentException("Unsupported file type! Only PDF or DOCX allowed.");
            }
        }
    }

    private void savePortfolio(Map<String, Object> portfolioData, User user) throws JsonProcessingException {
        Portfolio portfolio = new Portfolio();
        portfolio.setUser(user);
        portfolio.setBio((String) portfolioData.getOrDefault("bio", ""));

        // Convert skills and projects lists to JSON strings for database storage
        portfolio.setSkills(objectMapper.writeValueAsString(portfolioData.getOrDefault("skills", new ArrayList<>())));
        portfolio.setProjects(objectMapper.writeValueAsString(portfolioData.getOrDefault("projects", new ArrayList<>())));

        portfolioRepository.save(portfolio);
    }

    private String getPortfolioPrompt(String resumeText) {
        // This is your well-defined prompt, no changes needed here.
        return "You are a professional portfolio generator... [Your full prompt here]";
    }

    private String cleanJsonResponse(String rawResponse) {
        // Your existing cleanup logic
        if (rawResponse == null) return "{}";
        String cleaned = rawResponse.trim().replace("```json", "").replace("```", "");
        return cleaned.trim();
    }

    private Map<String, Object> parseJsonResponse(String jsonString) throws Exception {
        // Your existing parsing logic
        try {
            return objectMapper.readValue(jsonString, Map.class);
        } catch (Exception e) {
            System.err.println("Failed to parse AI response, returning default structure. Error: " + e.getMessage());
            Map<String, Object> defaultPortfolio = new HashMap<>();
            defaultPortfolio.put("bio", "Could not generate a bio. Please check the resume content.");
            defaultPortfolio.put("skills", new ArrayList<String>());
            defaultPortfolio.put("projects", new ArrayList<Map<String, String>>());
            return defaultPortfolio;
        }
    }

    private String getTemplateNameById(String templateId) {
        // Maps the template ID from the frontend to the actual Thymeleaf HTML filename
        switch (templateId) {
            case "classic-light":
                return "classic-light";
            case "creative-vibrant":
                return "creative-vibrant";
            case "modern-dark":
            default:
                return "modern-dark";
        }
    }
}