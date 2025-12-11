package com.lopsie.portfolio.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AIService {

    private final RestTemplate restTemplate;
    private final String apiKey;

    public AIService(@Value("${groq.api.key}") String apiKey) {
        this.apiKey = apiKey;
        this.restTemplate = new RestTemplate();
    }

    public String generatePortfolioContent(String resumeText) {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        Map<String, Object> requestBody = Map.of(
                "model", "meta-llama/llama-4-scout-17b-16e-instruct",
                "messages", new Object[] {
                        Map.of("role", "system", "content", "You are a portfolio generator."),
                        Map.of("role", "user", "content",
                                "Generate a professional portfolio from this resume. " +
                                        "Extract: Bio (2-3 sentences), Skills (comma separated), " +
                                        "Projects (with short descriptions). Resume: " + resumeText)
                });

        return callGroqApi(url, requestBody);
    }

    public String regenerateSection(String sectionType, String currentContent, String instructions) {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        String prompt = String.format("Rewrite the following %s. \n\nCurrent Content: %s\n\nInstructions: %s\n\n" +
                "Return ONLY the rewritten content, no markdown formatting, no explanations.",
                sectionType, currentContent, instructions);

        Map<String, Object> requestBody = Map.of(
                "model", "meta-llama/llama-4-scout-17b-16e-instruct",
                "messages", new Object[] {
                        Map.of("role", "system", "content",
                                "You are a helpful portfolio editor. You rewrite content strictly according to instructions."),
                        Map.of("role", "user", "content", prompt)
                });

        return callGroqApi(url, requestBody);
    }

    private String callGroqApi(String url, Map<String, Object> requestBody) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        if (response.getBody() == null || response.getBody().get("choices") == null) {
            return "No response from API";
        }

        var choices = (java.util.List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> firstChoice = (Map<String, Object>) choices.get(0).get("message");
        return firstChoice.get("content").toString().trim();
    }
}
