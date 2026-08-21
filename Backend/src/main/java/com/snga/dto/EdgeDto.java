package com.snga.dto;

/**
 * A single undirected edge in the graph response.
 * By convention {@code source < target} to guarantee deduplication.
 */
public class EdgeDto {

    private int source;
    private int target;

    public EdgeDto() {
    }

    public EdgeDto(int source, int target) {
        this.source = source;
        this.target = target;
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
}
