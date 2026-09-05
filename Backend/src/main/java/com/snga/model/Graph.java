package com.snga.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
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
    
    /**
     * Finds the shortest path between two users using Breadth-First Search (BFS).
     * <p>
     * Complexity: O(V + E) — standard BFS traverses nodes and edges once. In an
     * unweighted graph like this, BFS guarantees the shortest path.
     *
     * @return a list of user IDs representing the path from source to target,
     *         or an empty list if no path exists.
     */
    public List<Integer> getShortestPath(int source, int target) {
        if (!userExists(source) || !userExists(target)) {
            return Collections.emptyList();
        }

        if (source == target) {
            return Collections.singletonList(source);
        }

        Map<Integer, Integer> parentMap = new HashMap<>();
        Queue<Integer> queue = new LinkedList<>();
        Set<Integer> visited = new HashSet<>();

        queue.add(source);
        visited.add(source);

        boolean found = false;

        while (!queue.isEmpty()) {
            int current = queue.poll();

            if (current == target) {
                found = true;
                break;
            }

            Set<Integer> neighbors = adjacencyList.get(current);
            if (neighbors != null) {
                for (int neighbor : neighbors) {
                    if (!visited.contains(neighbor)) {
                        visited.add(neighbor);
                        parentMap.put(neighbor, current);
                        queue.add(neighbor);
                    }
                }
            }
        }

        if (!found) {
            return Collections.emptyList();
        }

        // Reconstruct path
        List<Integer> path = new ArrayList<>();
        Integer curr = target;
        while (curr != null) {
            path.add(curr);
            curr = parentMap.get(curr);
        }
        Collections.reverse(path);
        return path;
    }

    /**
     * Discovers all connected components in the graph using BFS.
     * <p>
     * Complexity: O(V + E) — each node and edge is visited exactly once
     * across all BFS traversals. Disconnected users (zero friends) each
     * become their own component of size 1.
     *
     * @return a list of components, where each component is a list of the
     *         user IDs that belong to it.
     */
    public List<List<Integer>> getConnectedComponents() {
        List<List<Integer>> components = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();

        for (int userId : users.keySet()) {
            if (visited.contains(userId)) {
                continue;
            }

            // BFS to discover the full component starting from userId
            List<Integer> component = new ArrayList<>();
            Queue<Integer> queue = new LinkedList<>();
            queue.add(userId);
            visited.add(userId);

            while (!queue.isEmpty()) {
                int current = queue.poll();
                component.add(current);

                Set<Integer> neighbors = adjacencyList.get(current);
                if (neighbors != null) {
                    for (int neighbor : neighbors) {
                        if (!visited.contains(neighbor)) {
                            visited.add(neighbor);
                            queue.add(neighbor);
                        }
                    }
                }
            }

            components.add(component);
        }

        return components;
    }

    /**
     * Counts the number of internal (undirected) edges within a set of
     * user IDs. Each edge is counted once.
     * <p>
     * Complexity: O(|members| * average degree) — iterates each member's
     * neighbour set and counts edges where both endpoints are in the set.
     */
    public int countInternalEdges(List<Integer> memberIds) {
        Set<Integer> memberSet = new HashSet<>(memberIds);
        int count = 0;
        for (int userId : memberIds) {
            Set<Integer> neighbors = adjacencyList.get(userId);
            if (neighbors != null) {
                for (int neighbor : neighbors) {
                    if (memberSet.contains(neighbor) && userId < neighbor) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    /**
     * Finds the mutual friends between two users by computing the intersection
     * of their friend sets.
     * <p>
     * Complexity: O(min(|A|, |B|)) where A and B are the friend sets of the
     * two users, since {@link HashSet#retainAll} iterates over the smaller set
     * and performs O(1) lookups in the larger set.
     *
     * @return a sorted list of mutual friend IDs, or an empty list if none.
     */
    public List<Integer> getMutualFriends(int userId1, int userId2) {
        if (!userExists(userId1) || !userExists(userId2)) {
            return Collections.emptyList();
        }

        Set<Integer> friends1 = getFriends(userId1);
        Set<Integer> friends2 = getFriends(userId2);

        Set<Integer> intersection = new HashSet<>(friends1);
        intersection.retainAll(friends2);

        List<Integer> result = new ArrayList<>(intersection);
        Collections.sort(result);
        return result;
    }

    /**
     * Represents a friend suggestion candidate.
     */
    public static class Suggestion implements Comparable<Suggestion> {
        public final int userId;
        public final int mutualFriendCount;
        public final List<Integer> mutualFriends;

        public Suggestion(int userId, int mutualFriendCount, List<Integer> mutualFriends) {
            this.userId = userId;
            this.mutualFriendCount = mutualFriendCount;
            this.mutualFriends = mutualFriends;
        }

        @Override
        public int compareTo(Suggestion other) {
            if (this.mutualFriendCount != other.mutualFriendCount) {
                return Integer.compare(other.mutualFriendCount, this.mutualFriendCount); // descending
            }
            return Integer.compare(this.userId, other.userId); // ascending
        }
    }

    /**
     * Generates friend suggestions for the given user based on friends-of-friends.
     * Candidates are ranked by how many mutual connections they share with the target user.
     * <p>
     * Complexity: roughly O(F x F_avg) where F is the user's friend count and F_avg
     * is the average friend count of those friends.
     *
     * @return a sorted list of {@link Suggestion} objects, or empty list if no candidates.
     */
    public List<Suggestion> getFriendSuggestions(int targetId) {
        if (!userExists(targetId)) {
            return Collections.emptyList();
        }

        Set<Integer> directFriends = getFriends(targetId);
        if (directFriends.isEmpty()) {
            return Collections.emptyList();
        }

        // Collect candidates (friends-of-friends)
        Set<Integer> candidates = new HashSet<>();
        for (int friendId : directFriends) {
            Set<Integer> friendsOfFriend = getFriends(friendId);
            for (int candidateId : friendsOfFriend) {
                if (candidateId != targetId && !directFriends.contains(candidateId)) {
                    candidates.add(candidateId);
                }
            }
        }

        List<Suggestion> suggestions = new ArrayList<>();
        for (int candidateId : candidates) {
            List<Integer> mutualFriends = getMutualFriends(targetId, candidateId);
            suggestions.add(new Suggestion(candidateId, mutualFriends.size(), mutualFriends));
        }

        Collections.sort(suggestions);
        return suggestions;
    }

    // --------------------------------------------------------------- getters

    public Map<Integer, User> getUsers() {
        return Collections.unmodifiableMap(users);
    }

    public Map<Integer, Set<Integer>> getAdjacencyList() {
        return Collections.unmodifiableMap(adjacencyList);
    }
}
