package com.lopsie.portfolio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS configuration for the entire application.
 * This is the standard and most robust way to handle CORS in Spring Boot.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Apply this configuration to all routes under /api/
                .allowedOrigins("http://localhost:3000",
                "https://portfolio-generator.hbhanot.tech") // Allow requests from your React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow all standard HTTP methods
                .allowedHeaders("*") // Allow all headers, which is crucial for the 'Authorization' header
                .allowCredentials(true); // Allow cookies and credentials to be sent
    }
}
