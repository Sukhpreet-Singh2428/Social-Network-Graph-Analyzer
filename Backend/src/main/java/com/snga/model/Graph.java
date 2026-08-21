package com.snga.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Undirected graph backed by an adjacency list.
 * <p>
 * Nodes are {@link User} objects keyed by their integer id.
 * Edges represent mutual friendships (undirected).
 * <p>
 * <b>Complexity (average case, HashMap/HashSet):</b>
 * <ul>
 *   <li>{@link #addFriendship(int, int)} — O(1)</li>
 *   <li>{@link #getFriends(int)} — O(1) lookup, returns the full neighbour set</li>
 *   <li>{@link #getEdges()} — O(V + E) where V = users, E = edges</li>
 * </ul>
 *
 * This class carries no Spring annotations so that it can be discussed
 * and whiteboarded as a standalone data-structure.
 */
public class Graph {

    /** userId → User object */
    private final Map<Integer, User> users = new HashMap<>();

    /** userId → set of neighbour userIds (undirected edges) */
    private final Map<Integer, Set<Integer>> adjacencyList = new HashMap<>();

    // ------------------------------------------------------------------ nodes

    /**
     * Adds a user (node) to the graph.  If a user with the same id already
     * exists, the call is silently ignored.
     */
    public void addUser(User user) {
        if (users.containsKey(user.getId())) {
            return;
        }
        users.put(user.getId(), user);
        adjacencyList.put(user.getId(), new HashSet<>());
    }

    /**
     * Returns {@code true} if a user with the given id exists in the graph.
     */
    public boolean userExists(int userId) {
        return users.containsKey(userId);
    }

    /**
     * Removes a user (node) and all of its edges from the graph.
     *
     * @return {@code true} if the user existed and was removed;
     *         {@code false} if no such user.
     */
    public boolean removeUser(int userId) {
        if (!users.containsKey(userId)) {
            return false;
        }
        // Remove this user from every neighbour's adjacency set
        Set<Integer> friends = adjacencyList.get(userId);
        if (friends != null) {
            for (int friendId : friends) {
                Set<Integer> friendSet = adjacencyList.get(friendId);
                if (friendSet != null) {
                    friendSet.remove(userId);
                }
            }
        }
        adjacencyList.remove(userId);
        users.remove(userId);
        return true;
    }

    // ------------------------------------------------------------------ edges

    /**
     * Creates an undirected edge (friendship) between two users.
     *
     * @return {@code true} if the edge was newly created;
     *         {@code false} if either user does not exist or the edge
     *         already exists.
     */
    public boolean addFriendship(int userId1, int userId2) {
        if (!userExists(userId1) || !userExists(userId2)) {
            return false;
        }
        if (userId1 == userId2) {
            return false; // no self-loops
        }
        boolean added = adjacencyList.get(userId1).add(userId2);
        adjacencyList.get(userId2).add(userId1);
        return added;
    }

    /**
     * Removes an undirected edge (friendship) between two users.
     *
     * @return {@code true} if the edge existed and was removed;
     *         {@code false} otherwise.
     */
    public boolean removeFriendship(int userId1, int userId2) {
        if (!userExists(userId1) || !userExists(userId2)) {
            return false;
        }
        boolean removed = adjacencyList.get(userId1).remove(userId2);
        adjacencyList.get(userId2).remove(userId1);
        return removed;
    }

    // ---------------------------------------------------------------- queries

    /**
     * Returns an unmodifiable view of the neighbour ids for the given user.
     * Returns an empty set if the user has no friends or does not exist.
     */
    public Set<Integer> getFriends(int userId) {
        Set<Integer> friends = adjacencyList.get(userId);
        if (friends == null) {
            return Collections.emptySet();
        }
        return Collections.unmodifiableSet(friends);
    }

    /**
     * Returns every undirected edge exactly once as a list of
     * {@code int[]{source, target}} pairs where {@code source < target}.
     * <p>
     * Complexity: O(V + E) — iterates each user's neighbour set once,
     * emitting the edge only when the current userId is the smaller id.
     */
    public List<int[]> getEdges() {
        List<int[]> edges = new ArrayList<>();
        for (Map.Entry<Integer, Set<Integer>> entry : adjacencyList.entrySet()) {
            int userId = entry.getKey();
            for (int friendId : entry.getValue()) {
                if (userId < friendId) {
                    edges.add(new int[]{userId, friendId});
                }
            }
        }
        return edges;
    }

    // --------------------------------------------------------------- getters

    public Map<Integer, User> getUsers() {
        return Collections.unmodifiableMap(users);
    }

    public Map<Integer, Set<Integer>> getAdjacencyList() {
        return Collections.unmodifiableMap(adjacencyList);
    }

    // TODO(chunk-5): Graph traversal methods (BFS, DFS) will be added here
    // TODO(chunk-5): Mutual friends, connected components, shortest path
}
