package com.snga.controller;

import com.snga.dto.CommunityResponse;
import com.snga.dto.GraphResponse;
import com.snga.dto.PathResponse;
import com.snga.service.GraphService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for graph-level queries: full snapshot, shortest path,
 * and connected components (communities).
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

    /**
     * GET /api/graph/path?source={id}&target={id}
     * Returns the shortest path between source and target using BFS.
     */
    @GetMapping("/graph/path")
    public PathResponse getShortestPath(@RequestParam int source, @RequestParam int target) {
        return graphService.getShortestPath(source, target);
    }

    /**
     * GET /api/graph/communities — returns all connected components
     * with member lists, sizes, and internal edge counts.
     */
    @GetMapping("/graph/communities")
    public CommunityResponse getCommunities() {
        return graphService.getCommunities();
    }
}
