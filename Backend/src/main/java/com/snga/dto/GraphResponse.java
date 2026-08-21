package com.snga.dto;

import java.util.List;

/**
 * Response body for {@code GET /api/graph} — the full graph snapshot
 * with deduplicated edges.
 */
public class GraphResponse {

    private List<NodeDto> nodes;
    private List<EdgeDto> edges;

    public GraphResponse() {
    }

    public GraphResponse(List<NodeDto> nodes, List<EdgeDto> edges) {
        this.nodes = nodes;
        this.edges = edges;
    }

    public List<NodeDto> getNodes() {
        return nodes;
    }

    public void setNodes(List<NodeDto> nodes) {
        this.nodes = nodes;
    }

    public List<EdgeDto> getEdges() {
        return edges;
    }

    public void setEdges(List<EdgeDto> edges) {
        this.edges = edges;
    }
}
