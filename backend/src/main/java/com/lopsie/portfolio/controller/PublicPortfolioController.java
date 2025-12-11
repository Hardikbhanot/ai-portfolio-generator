package com.lopsie.portfolio.controller;

import com.lopsie.portfolio.entity.Portfolio;
import com.lopsie.portfolio.entity.User;
import com.lopsie.portfolio.repository.PortfolioRepository;
import com.lopsie.portfolio.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicPortfolioController {

    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;

    public PublicPortfolioController(UserRepository userRepository, PortfolioRepository portfolioRepository) {
        this.userRepository = userRepository;
        this.portfolioRepository = portfolioRepository;
    }

    @GetMapping("/portfolio/{subdomain}")
    public ResponseEntity<?> getPortfolioBySubdomain(@PathVariable String subdomain) {
        return userRepository.findBySubdomain(subdomain)
                .flatMap(portfolioRepository::findTopByUserOrderByIdDesc) // Get latest portfolio
                .map(portfolio -> {
                    // Return only what is needed for rendering
                    return ResponseEntity.ok(Map.of(
                            "html", portfolio.getGjsHtml() != null ? portfolio.getGjsHtml() : "",
                            "css", portfolio.getGjsCss() != null ? portfolio.getGjsCss() : "",
                            "ownerName", portfolio.getUser().getName()));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
