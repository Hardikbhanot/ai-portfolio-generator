package com.lopsie.portfolio.controller;

import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.service.PortfolioGenerationService;
import com.lopsie.portfolio.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.Collections;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

    private final PortfolioGenerationService portfolioGenerationService;
    private final UserService userService;
    private final com.lopsie.portfolio.repository.PortfolioRepository portfolioRepository; // Inject Repo

    public PortfolioController(PortfolioGenerationService portfolioGenerationService, UserService userService,
            com.lopsie.portfolio.repository.PortfolioRepository portfolioRepository) {
        this.portfolioGenerationService = portfolioGenerationService;
        this.userService = userService;
        this.portfolioRepository = portfolioRepository;
    }

    /**
     * The main endpoint for generating portfolio data from an uploaded resume.
     * It requires the user to be authenticated.
     *
     * @param file        The resume file (.pdf or .docx) uploaded by the user.
     * @param userDetails The details of the currently logged-in user, provided by
     *                    Spring Security.
     * @return A response containing the structured portfolio data as a JSON object.
     */
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generatePortfolioData(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Find the full User entity from the username (email) provided by Spring
        // Security.
        User currentUser = userService.findByEmail(userDetails.getUsername());

        // Delegate the complex logic of file parsing and AI interaction to the service.
        Map<String, Object> portfolioData = portfolioGenerationService.generatePortfolioData(file, currentUser);

        // Return a successful response with the JSON data.
        return ResponseEntity.ok(portfolioData);
    }

    // --- GrapesJS Storage Endpoints ---

    @PostMapping("/{id}/store")
    public ResponseEntity<?> savePortfolio(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        return portfolioRepository.findById(id).map(portfolio -> {
            try {
                // Store the full JSON for the editor
                portfolio.setGjsData(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(data));

                // Extract HTML and CSS for public viewing
                if (data.containsKey("gjs-html")) {
                    portfolio.setGjsHtml((String) data.get("gjs-html"));
                }
                if (data.containsKey("gjs-css")) {
                    portfolio.setGjsCss((String) data.get("gjs-css"));
                }

                portfolioRepository.save(portfolio);
                return ResponseEntity.ok().build();
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Failed to save portfolio.");
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/load")
    public ResponseEntity<?> loadPortfolio(@PathVariable Long id) {
        return portfolioRepository.findById(id).map(portfolio -> {
            try {
                String data = portfolio.getGjsData();
                if (data == null || data.isEmpty()) {
                    // Return 404 to trigger GrapesJS fallback to project.default
                    return ResponseEntity.notFound().build();
                }
                return ResponseEntity.ok(new ObjectMapper().readValue(data, Map.class));
            } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}
