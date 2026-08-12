package com.snga.model;

/**
 * Represents a user (node) in the social network graph.
 * <p>
 * The {@code id} is immutable once assigned; the {@code name} may be
 * updated after construction.
 */
public class User {

    private final int id;
    private String name;

    public User(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{id=" + id + ", name='" + name + "'}";
    }
}
