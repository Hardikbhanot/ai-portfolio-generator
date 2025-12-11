package com.lopsie.portfolio.controller;

import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.service.PortfolioGenerationService;
import com.lopsie.portfolio.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

    private final PortfolioGenerationService portfolioGenerationService;
    private final UserService userService;

    public PortfolioController(PortfolioGenerationService portfolioGenerationService, UserService userService) {
        this.portfolioGenerationService = portfolioGenerationService;
        this.userService = userService;
    }

    /**
     * The main endpoint for generating portfolio data from an uploaded resume.
     * It requires the user to be authenticated.
     *
     * @param file The resume file (.pdf or .docx) uploaded by the user.
     * @param userDetails The details of the currently logged-in user, provided by Spring Security.
     * @return A response containing the structured portfolio data as a JSON object.
     */
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generatePortfolioData(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Find the full User entity from the username (email) provided by Spring Security.
        User currentUser = userService.findByEmail(userDetails.getUsername());

        // Delegate the complex logic of file parsing and AI interaction to the service.
        Map<String, Object> portfolioData = portfolioGenerationService.generatePortfolioData(file, currentUser);

        // Return a successful response with the JSON data.
        return ResponseEntity.ok(portfolioData);
    }

    /**
     * A placeholder endpoint for fetching all saved portfolios for the currently authenticated user.
     * (Functionality to be implemented in the service layer).
     */
    @GetMapping
    public ResponseEntity<?> getUserPortfolios(@AuthenticationPrincipal UserDetails userDetails) {
        // TODO: Implement logic in a service to find all portfolios associated with the user.
        return ResponseEntity.ok("Endpoint to get all portfolios for user: " + userDetails.getUsername());
    }
}

