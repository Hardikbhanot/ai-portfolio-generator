package com.lopsie.portfolio.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.exception.AIParsingException;
import com.lopsie.portfolio.exception.ResumeParsingException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Map;

@Service
public class PortfolioGenerationService {

    private static final Logger log = LoggerFactory.getLogger(PortfolioGenerationService.class);

    private final AIService aiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // The constructor is simplified for the CSR model.
    public PortfolioGenerationService(AIService aiService) {
        this.aiService = aiService;
    }

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
            String resumeText = parseResumeFile(file);
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
        String prompt = getPortfolioPrompt(resumeText);
        String rawJsonResponse = aiService.generatePortfolioContent(prompt);
        String cleanedJsonResponse = cleanJsonResponse(rawJsonResponse);

        try {
            return objectMapper.readValue(cleanedJsonResponse, new TypeReference<>() {});
        } catch (Exception e) {
            log.error("Failed to parse JSON from AI response: {}", cleanedJsonResponse, e);
            throw new AIParsingException("The AI response was not in a valid format.", e);
        }
    }

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
        if (rawResponse == null || rawResponse.isBlank()) {
            return "{\"bio\":\"\", \"skills\":[], \"projects\":[]}";
        }
        int firstBrace = rawResponse.indexOf('{');
        int lastBrace = rawResponse.lastIndexOf('}');
        if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
            return rawResponse.substring(firstBrace, lastBrace + 1);
        }
        log.warn("Could not find a valid JSON structure in the AI response. Raw response: {}", rawResponse);
        return "{\"bio\":\"\", \"skills\":[], \"projects\":[]}";
    }
}