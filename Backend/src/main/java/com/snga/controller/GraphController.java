package com.snga.controller;

import com.snga.dto.GraphResponse;
import com.snga.service.GraphService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller that returns the entire graph (nodes + deduplicated edges)
 * in a single call, for the frontend visualisation layer.
 */
@RestController
@RequestMapping("/api")
public class GraphController {

    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    /**
     * GET /api/graph — returns all users as nodes and all friendships as
     * edges (each undirected edge appears exactly once, with source &lt; target).
     */
    @GetMapping("/graph")
    public GraphResponse getFullGraph() {
        return graphService.getFullGraph();
    }
}
