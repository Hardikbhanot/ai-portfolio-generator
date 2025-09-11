package com.lopsie.portfolio.exception;

import com.lopsie.portfolio.dto.GenerationResponse;
import com.lopsie.portfolio.service.PortfolioGenerationService.AIParsingException;
import com.lopsie.portfolio.service.PortfolioGenerationService.ResumeParsingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler({ResumeParsingException.class, AIParsingException.class})
    public ResponseEntity<GenerationResponse> handlePortfolioGenerationExceptions(RuntimeException ex) {
        log.warn("Portfolio generation failed: {}", ex.getMessage());
        return new ResponseEntity<>(GenerationResponse.failure(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<GenerationResponse> handleGenericException(Exception ex) {
        log.error("An unexpected internal server error occurred", ex);
        return new ResponseEntity<>(GenerationResponse.failure("An unexpected internal server error occurred. Please try again later."), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}