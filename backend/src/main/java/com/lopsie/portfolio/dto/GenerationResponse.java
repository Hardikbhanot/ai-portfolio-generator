package com.lopsie.portfolio.dto;

/**
 * A standard response object for the portfolio generation endpoints.
 * It provides a consistent structure for both success and failure cases.
 */
public class GenerationResponse {

    private boolean success;
    private String message;
    private String htmlContent; // This field holds the final HTML string

    // Private constructor to encourage use of static factory methods
    private GenerationResponse(boolean success, String message, String htmlContent) {
        this.success = success;
        this.message = message;
        this.htmlContent = htmlContent;
    }

    /**
     * Creates a standardized success response object.
     * @param html The generated HTML content of the portfolio.
     * @return A new GenerationResponse object for a successful operation.
     */
    public static GenerationResponse success(String html) {
        return new GenerationResponse(true, "Portfolio generated successfully.", html);
    }

    /**
     * Creates a standardized failure response object.
     * @param message A user-friendly error message explaining what went wrong.
     * @return A new GenerationResponse object for a failed operation.
     */
    public static GenerationResponse failure(String message) {
        return new GenerationResponse(false, message, null);
    }

    // --- Standard Getters and Setters ---

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getHtmlContent() {
        return htmlContent;
    }

    public void setHtmlContent(String htmlContent) {
        this.htmlContent = htmlContent;
    }
}