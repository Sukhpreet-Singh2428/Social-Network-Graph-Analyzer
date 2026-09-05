package com.snga.controller;

import com.snga.dto.MutualFriendsResponse;
import com.snga.dto.SuggestionResponse;
import com.snga.dto.UserRequest;
import com.snga.model.User;
import com.snga.service.GraphService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * REST controller for user (node) operations.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final GraphService graphService;

    public UserController(GraphService graphService) {
        this.graphService = graphService;
    }

    /**
     * POST /api/users — create a new user.
     * Returns 201 on success, 409 if the id already exists.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createUser(@Valid @RequestBody UserRequest req) {
        User user = graphService.addUser(req.getId(), req.getName());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "id", user.getId(),
                        "name", user.getName()
                ));
    }

    /**
     * DELETE /api/users/{id} — remove a user and all their edges.
     * Returns 204 on success, 404 if not found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        graphService.removeUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/users — list all users.
     */
    @GetMapping
    public Collection<User> getAllUsers() {
        return graphService.getAllUsers();
    }

    /**
     * GET /api/users/{id}/friends — list a user's direct friend ids.
     * Returns 404 if the user doesn't exist.
     */
    @GetMapping("/{id}/friends")
    public Set<Integer> getFriends(@PathVariable int id) {
        return graphService.getFriends(id);
    }

    /**
     * GET /api/users/{id}/mutual-friends/{otherId} — returns the mutual
     * friends between two users.
     */
    @GetMapping("/{id}/mutual-friends/{otherId}")
    public MutualFriendsResponse getMutualFriends(@PathVariable int id, @PathVariable int otherId) {
        return graphService.getMutualFriends(id, otherId);
    }

    /**
     * GET /api/users/{id}/suggestions — returns friend suggestions for
     * the user based on friends-of-friends, ranked by mutual friend count.
     */
    @GetMapping("/{id}/suggestions")
    public List<SuggestionResponse> getFriendSuggestions(@PathVariable int id) {
        return graphService.getFriendSuggestions(id);
    }
}
