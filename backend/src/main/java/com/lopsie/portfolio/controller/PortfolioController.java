package com.lopsie.portfolio.controller;

import com.lopsie.portfolio.dto.GenerationResponse;
import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.service.PortfolioGenerationService;
import com.lopsie.portfolio.service.UserService; // Import UserService
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = "http://localhost:3000")
public class PortfolioController {

    private final PortfolioGenerationService portfolioGenerationService;
    private final UserService userService; // Use UserService instead of UserRepository

    public PortfolioController(PortfolioGenerationService portfolioGenerationService, UserService userService) {
        this.portfolioGenerationService = portfolioGenerationService;
        this.userService = userService;
    }

    /**
     * The main endpoint for generating a portfolio from an uploaded resume.
     * It requires the user to be authenticated.
     *
     * @param file The resume file (.pdf or .docx) uploaded by the user.
     * @param templateId The ID of the template selected by the user.
     * @param userDetails The details of the currently logged-in user, provided by Spring Security.
     * @return A response containing the final, styled HTML of the generated portfolio.
     */
    @PostMapping("/generate")
    public ResponseEntity<GenerationResponse> generatePortfolioFromFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("templateId") String templateId,
            @AuthenticationPrincipal UserDetails userDetails) {

        // The try-catch block is no longer needed here.
        // Exceptions will be handled globally by the GlobalExceptionHandler.

        // 1. Find the User entity using the UserService
        User currentUser = userService.findByEmail(userDetails.getUsername());

        // 2. Delegate the complex logic to the generation service
        String generatedHtml = portfolioGenerationService.generateAndSavePortfolio(file, templateId, currentUser);

        // 3. Return a successful response
        return ResponseEntity.ok(GenerationResponse.success(generatedHtml));
    }

    /**
     * Fetches all saved portfolios for the currently authenticated user.
     * (Functionality to be implemented in the service layer).
     */
    @GetMapping
    public ResponseEntity<?> getUserPortfolios(@AuthenticationPrincipal UserDetails userDetails) {
        // TODO: Implement logic in PortfolioGenerationService to find portfolios by user
        return ResponseEntity.ok("Endpoint to get all portfolios for user: " + userDetails.getUsername());
    }
}