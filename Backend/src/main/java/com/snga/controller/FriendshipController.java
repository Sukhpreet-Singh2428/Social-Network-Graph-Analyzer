package com.snga.controller;

import com.snga.dto.FriendshipRequest;
import com.snga.service.GraphService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for friendship (edge) operations.
 */
@RestController
@RequestMapping("/api/friendships")
public class FriendshipController {

    private final GraphService graphService;

    public FriendshipController(GraphService graphService) {
        this.graphService = graphService;
    }

    /**
     * POST /api/friendships — create an undirected friendship.
     * Returns 201 on success.
     * 400 if userId1 == userId2, 404 if either user missing, 409 if already friends.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addFriendship(@RequestBody FriendshipRequest req) {
        graphService.addFriendship(req.getUserId1(), req.getUserId2());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Friendship created",
                        "userId1", req.getUserId1(),
                        "userId2", req.getUserId2()
                ));
    }

    /**
     * DELETE /api/friendships — remove a friendship.
     * Returns 204 on success. 404 if either user or the friendship doesn't exist.
     */
    @DeleteMapping
    public ResponseEntity<Void> removeFriendship(@RequestBody FriendshipRequest req) {
        graphService.removeFriendship(req.getUserId1(), req.getUserId2());
        return ResponseEntity.noContent().build();
    }
}
