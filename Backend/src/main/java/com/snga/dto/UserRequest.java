package com.snga.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request body for creating a user.
 */
public class UserRequest {

    private int id;

    @NotBlank(message = "name must not be blank")
    private String name;

    public UserRequest() {
    }

    public UserRequest(int id, String name) {
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
