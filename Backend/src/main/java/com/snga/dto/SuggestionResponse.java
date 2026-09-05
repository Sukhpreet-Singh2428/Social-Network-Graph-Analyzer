package com.snga.dto;

import java.util.List;

/**
 * Response body for {@code GET /api/users/{id}/suggestions}.
 * Represents a single friend suggestion (a candidate user) and the mutual
 * friends they share with the target user.
 */
public class SuggestionResponse {

    private int userId;
    private String name;
    private int mutualFriendCount;
    private List<Integer> mutualFriends;

    public SuggestionResponse() {
    }

    public SuggestionResponse(int userId, String name, int mutualFriendCount, List<Integer> mutualFriends) {
        this.userId = userId;
        this.name = name;
        this.mutualFriendCount = mutualFriendCount;
        this.mutualFriends = mutualFriends;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getMutualFriendCount() {
        return mutualFriendCount;
    }

    public void setMutualFriendCount(int mutualFriendCount) {
        this.mutualFriendCount = mutualFriendCount;
    }

    public List<Integer> getMutualFriends() {
        return mutualFriends;
    }

    public void setMutualFriends(List<Integer> mutualFriends) {
        this.mutualFriends = mutualFriends;
    }
}
