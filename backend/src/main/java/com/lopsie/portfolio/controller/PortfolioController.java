package com.lopsie.portfolio.controller;

import com.lopsie.portfolio.dto.GenerationResponse;
import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.repository.UserRepository;
import com.lopsie.portfolio.service.PortfolioGenerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/portfolios") // Correct base path for the portfolio resource
@CrossOrigin(origins = "http://localhost:3000")
public class PortfolioController {

    private final PortfolioGenerationService portfolioGenerationService;
    private final UserRepository userRepository;

    public PortfolioController(PortfolioGenerationService portfolioGenerationService, UserRepository userRepository) {
        this.portfolioGenerationService = portfolioGenerationService;
        this.userRepository = userRepository;
    }

    /**
     * This is the main endpoint for generating a portfolio.
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

        try {
            // Find the full User entity from the username (email)
            User currentUser = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found in the database."));

            // Delegate all the complex logic to the service
            String generatedHtml = portfolioGenerationService.generateAndSavePortfolio(file, templateId, currentUser);

            // Return a successful response with the HTML content
            return ResponseEntity.ok(GenerationResponse.success(generatedHtml));

        } catch (Exception e) {
            // Return a user-friendly error message if something goes wrong
            return ResponseEntity.badRequest().body(GenerationResponse.failure(e.getMessage()));
        }
    }


    @GetMapping
    public ResponseEntity<?> getUserPortfolios(@AuthenticationPrincipal UserDetails userDetails) {
        // TODO: Implement logic in your service to find all portfolios by user
        return ResponseEntity.ok("Endpoint to get all portfolios for user: " + userDetails.getUsername());
    }
}