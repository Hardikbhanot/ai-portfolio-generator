package com.lopsie.portfolio.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lopsie.portfolio.entity.Portfolio;
import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.repository.PortfolioRepository;
import com.lopsie.portfolio.service.PortfolioGenerationService.AIParsingException;
import com.lopsie.portfolio.service.PortfolioGenerationService.ResumeParsingException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.InputStream;
import java.util.Collections;
import java.util.Map;

@Service
public class PortfolioGenerationService {

    private static final Logger log = LoggerFactory.getLogger(PortfolioGenerationService.class);

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
     * Orchestrates the entire process of generating a portfolio from a resume,
     * saving it, and rendering it as HTML using a specific template.
     */
//    public String generateAndSavePortfolio(MultipartFile file, String templateId, User user) {
//        try {
//            String resumeText = parseResumeFile(file);
//            if (resumeText.isBlank()) {
//                throw new ResumeParsingException("Resume content is empty or could not be read.");
//            }
//
//            Map<String, Object> portfolioData = getAIPortfolioData(resumeText);
//            savePortfolio(portfolioData, user);
//            return renderPortfolioHtml(portfolioData, templateId);
//
//        } catch (ResumeParsingException | AIParsingException e) {
//            log.error("Validation error during portfolio generation for user {}: {}", user.getEmail(), e.getMessage());
//            throw e;
//        } catch (Exception e) {
//            log.error("An unexpected error occurred during portfolio generation for user {}", user.getEmail(), e);
//            throw new RuntimeException("An unexpected error occurred. Please try again later.", e);
//        }
//    }


    /**
     * Generates a structured MAP of portfolio data from a resume.
     * This map will be sent as a JSON object to the frontend GrapesJS editor.
     *
     * @param file The resume file uploaded by the user.
     * @param user The authenticated user.
     * @return A Map representing the structured portfolio data.
     */
    public Map<String, Object> generatePortfolioData(MultipartFile file, User user) {
        try {
            String resumeText = parseResumeFile(file); // Your existing file parsing logic
            return getAIPortfolioData(resumeText);
        } catch (Exception e) {
            log.error("Failed to generate portfolio data for user {}", user.getEmail(), e);
            // Re-throw to be caught by your GlobalExceptionHandler
            throw new RuntimeException("Failed to generate portfolio data.", e);
        }
    }
    private String parseResumeFile(MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename == null || file.isEmpty()) {
            throw new ResumeParsingException("Invalid or empty file provided.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            if (filename.toLowerCase().endsWith(".pdf")) {
                try (PDDocument document = PDDocument.load(inputStream)) {
                    return new PDFTextStripper().getText(document);
                }
            } else if (filename.toLowerCase().endsWith(".docx")) {
                try (XWPFDocument doc = new XWPFDocument(inputStream)) {
                    StringBuilder text = new StringBuilder();
                    doc.getParagraphs().forEach(p -> text.append(p.getText()).append("\n"));
                    return text.toString();
                }
            } else {
                throw new ResumeParsingException("Unsupported file type. Please upload a PDF or DOCX.");
            }
        } catch (Exception e) {
            throw new ResumeParsingException("Failed to parse resume file: " + filename, e);
        }
    }

    private Map<String, Object> getAIPortfolioData(String resumeText) {
        String prompt = getPortfolioPrompt(resumeText); // Your existing prompt logic
        String rawJsonResponse = aiService.generatePortfolioContent(prompt);
        String cleanedJsonResponse = cleanJsonResponse(rawJsonResponse); // Your existing cleaning logic

        try {
            // Use TypeReference to correctly parse the JSON into a Map
            return objectMapper.readValue(cleanedJsonResponse, new TypeReference<>() {});
        } catch (Exception e) {
            log.error("Failed to parse JSON from AI response: {}", cleanedJsonResponse, e);
            throw new AIParsingException("The AI response was not in a valid format.", e);
        }
    }
//
//    private void savePortfolio(Map<String, Object> portfolioData, User user) {
//        try {
//            Portfolio portfolio = new Portfolio();
//            portfolio.setUser(user);
//            portfolio.setBio((String) portfolioData.getOrDefault("bio", ""));
//            portfolio.setSkills(objectMapper.writeValueAsString(portfolioData.getOrDefault("skills", Collections.emptyList())));
//            portfolio.setProjects(objectMapper.writeValueAsString(portfolioData.getOrDefault("projects", Collections.emptyList())));
//            portfolioRepository.save(portfolio);
//        } catch (JsonProcessingException e) {
//            log.error("Failed to serialize portfolio data for database persistence.", e);
//            throw new RuntimeException("Error preparing portfolio data for saving.", e);
//        }
//    }
//
//    private String renderPortfolioHtml(Map<String, Object> portfolioData, String templateId) {
//        Context context = new Context();
//        context.setVariable("portfolio", portfolioData);
//        String templateName = getTemplateNameById(templateId);
//        return templateEngine.process(templateName, context);
//    }

    // --- Unchanged Private Helper Methods ---

        private String getPortfolioPrompt(String resumeText) {
            // This updated prompt is more aggressive about the required format.
            return "Analyze the following resume text. Your task is to extract key information and return it as a single, valid JSON object. " +
                    "Your response MUST start with `{` and end with `}`. " +
                    "DO NOT include any introductory text, explanations, apologies, or markdown code fences like ```json. " +
                    "ONLY the raw JSON object is allowed. " +
                    "For example, a bad response is: 'Here is the JSON you requested: ```json{\"bio\":...}```'. " +
                    "A good response is: '{\"bio\":...}'.\n" +
                    "The JSON object must have this exact structure: " +
                    "{\"bio\": \"[A short, professional bio]\", \"skills\": [\"skill1\", \"skill2\"], \"projects\": [{\"name\": \"Project Name\", \"description\": \"Project description\"}]}.\n" +
                    "If a section is not found, return an empty string for \"bio\" or empty arrays for \"skills\" and \"projects\".\n" +
                    "Here is the resume content:\n" +
                    "\"\"\"\n" +
                    resumeText + "\n" +
                    "\"\"\"\n";
        }


    private String cleanJsonResponse(String rawResponse) {
        if (rawResponse == null || rawResponse.isBlank()) return "{}";
        return rawResponse.trim().replace("```json", "").replace("```", "");
    }

    private String getTemplateNameById(String templateId) {
        return switch (templateId) {
            case "classic-light" -> "classic-light";
            case "creative-vibrant" -> "creative-vibrant";
            default -> "modern-dark";
        };
    }

    // --- NESTED EXCEPTION CLASSES ---

    /**
     * Custom exception for errors occurring during resume file parsing.
     */
    public static class ResumeParsingException extends RuntimeException {
        public ResumeParsingException(String message) {
            super(message);
        }
        public ResumeParsingException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    /**
     * Custom exception for errors occurring during AI response parsing.
     */
    public static class AIParsingException extends RuntimeException {
        public AIParsingException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
