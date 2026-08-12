package com.snga.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS configuration for the REST API.
 * <p>
 * Allows the Vite/React dev server to call {@code /api/**} endpoints
 * during local development. Update {@link #ALLOWED_ORIGIN} if the
 * frontend runs on a different port.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /** Origin of the Vite dev server — change this if the frontend port differs. */
    private static final String ALLOWED_ORIGIN = "http://localhost:5173";

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(ALLOWED_ORIGIN)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
