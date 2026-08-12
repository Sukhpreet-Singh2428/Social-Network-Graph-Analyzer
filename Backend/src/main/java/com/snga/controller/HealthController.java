package com.snga.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Lightweight health-check endpoint used to verify the backend is
 * running and that CORS is configured correctly from the frontend.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    // TODO(chunk-3): inject GraphService once it exists to report richer status

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
                "status", "UP",
                "service", "social-network-graph-analyzer"
        );
    }
}
