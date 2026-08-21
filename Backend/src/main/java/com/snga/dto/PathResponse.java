package com.snga.dto;

import java.util.List;

/**
 * Response body for {@code GET /api/graph/path} — returns the shortest path
 * between two nodes.
 */
public class PathResponse {

    private int source;
    private int target;
    private List<Integer> path;
    private int distance;

    public PathResponse() {
    }

    public PathResponse(int source, int target, List<Integer> path, int distance) {
        this.source = source;
        this.target = target;
        this.path = path;
        this.distance = distance;
    }

    public int getSource() {
        return source;
    }

    public void setSource(int source) {
        this.source = source;
    }

    public int getTarget() {
        return target;
    }

    public void setTarget(int target) {
        this.target = target;
    }

    public List<Integer> getPath() {
        return path;
    }

    public void setPath(List<Integer> path) {
        this.path = path;
    }

    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }
}
