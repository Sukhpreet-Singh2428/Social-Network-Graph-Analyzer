package com.snga.dto;

/**
 * A single node in the graph response — corresponds to a {@link com.snga.model.User}.
 */
public class NodeDto {

    private int id;
    private String name;

    public NodeDto() {
    }

    public NodeDto(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
