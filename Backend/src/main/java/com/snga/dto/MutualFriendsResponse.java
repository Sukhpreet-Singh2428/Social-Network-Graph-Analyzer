package com.snga.dto;

import java.util.List;

/**
 * Response body for {@code GET /api/users/{id}/mutual-friends/{otherId}}.
 * Contains the overlapping set of friend IDs between the two users.
 */
public class MutualFriendsResponse {

    private int userId;
    private int otherUserId;
    private List<Integer> mutualFriends;
    private int count;

    public MutualFriendsResponse() {
    }

    public MutualFriendsResponse(int userId, int otherUserId, List<Integer> mutualFriends, int count) {
        this.userId = userId;
        this.otherUserId = otherUserId;
        this.mutualFriends = mutualFriends;
        this.count = count;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(int otherUserId) {
        this.otherUserId = otherUserId;
    }

    public List<Integer> getMutualFriends() {
        return mutualFriends;
    }

    public void setMutualFriends(List<Integer> mutualFriends) {
        this.mutualFriends = mutualFriends;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
