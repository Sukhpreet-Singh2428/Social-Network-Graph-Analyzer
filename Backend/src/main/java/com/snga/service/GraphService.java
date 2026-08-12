package com.snga.service;

import com.snga.exception.ApiException;
import com.snga.model.Graph;
import com.snga.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Set;

/**
 * Spring-managed singleton wrapping the in-memory {@link Graph}.
 * <p>
 * Exposes CRUD-style operations on users and friendships with
 * validation that throws {@link ApiException} on invalid input.
 */
@Service
public class GraphService {

    private final Graph graph = new Graph();

    // ------------------------------------------------------------------ users

    /**
     * Adds a new user to the graph.
     *
     * @throws ApiException 409 if a user with the given id already exists.
     */
    public User addUser(int id, String name) {
        if (graph.userExists(id)) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "User with id " + id + " already exists");
        }
        User user = new User(id, name);
        graph.addUser(user);
        return user;
    }

    /**
     * Removes a user and all of its edges from the graph.
     *
     * @throws ApiException 404 if the user does not exist.
     */
    public void removeUser(int id) {
        if (!graph.userExists(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND,
                    "User with id " + id + " not found");
        }
        graph.removeUser(id);
    }

    /**
     * Returns all users currently in the graph.
     */
    public Collection<User> getAllUsers() {
        return graph.getUsers().values();
    }

    // --------------------------------------------------------------- friends

    /**
     * Creates an undirected friendship between two users.
     *
     * @throws ApiException 400 if the two ids are equal (self-friendship).
     * @throws ApiException 404 if either user does not exist.
     * @throws ApiException 409 if the friendship already exists.
     */
    public void addFriendship(int userId1, int userId2) {
        if (userId1 == userId2) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Cannot create a friendship between a user and themselves");
        }
        if (!graph.userExists(userId1)) {
            throw new ApiException(HttpStatus.NOT_FOUND,
                    "User with id " + userId1 + " not found");
        }
        if (!graph.userExists(userId2)) {
            throw new ApiException(HttpStatus.NOT_FOUND,
                    "User with id " + userId2 + " not found");
        }
        boolean added = graph.addFriendship(userId1, userId2);
        if (!added) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "Friendship between " + userId1 + " and " + userId2 + " already exists");
        }
    }

    /**
     * Removes an undirected friendship between two users.
     *
     * @throws ApiException 404 if either user does not exist or the
     *                      friendship does not exist.
     */
    public void removeFriendship(int userId1, int userId2) {
        if (!graph.userExists(userId1)) {
            throw new ApiException(HttpStatus.NOT_FOUND,
                    "User with id " + userId1 + " not found");
        }
        if (!graph.userExists(userId2)) {
            throw new ApiException(HttpStatus.NOT_FOUND,
                    "User with id " + userId2 + " not found");
        }
        boolean removed = graph.removeFriendship(userId1, userId2);
        if (!removed) {
            throw new ApiException(HttpStatus.NOT_FOUND,
                    "Friendship between " + userId1 + " and " + userId2 + " does not exist");
        }
    }

    /**
     * Returns the set of friend ids for the given user.
     *
     * @throws ApiException 404 if the user does not exist.
     */
    public Set<Integer> getFriends(int userId) {
        if (!graph.userExists(userId)) {
            throw new ApiException(HttpStatus.NOT_FOUND,
                    "User with id " + userId + " not found");
        }
        return graph.getFriends(userId);
    }

    // TODO(chunk-5): BFS, shortest path — will delegate to Graph traversal methods
    // TODO(chunk-6): mutual friends, connected components
}
