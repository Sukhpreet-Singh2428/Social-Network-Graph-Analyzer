package com.snga.dto;

import java.util.List;

/**
 * Response body for {@code GET /api/graph/communities} — wraps the list
 * of connected components, each with its members and internal edge count.
 */
public class CommunityResponse {

    private List<Community> communities;

    public CommunityResponse() {
    }

    public CommunityResponse(List<Community> communities) {
        this.communities = communities;
    }

    public List<Community> getCommunities() {
        return communities;
    }

    public void setCommunities(List<Community> communities) {
        this.communities = communities;
    }

    /**
     * A single connected component in the graph.
     */
    public static class Community {

        private int id;
        private List<Integer> members;
        private int size;
        private int internalEdgeCount;

        public Community() {
        }

        public Community(int id, List<Integer> members, int size, int internalEdgeCount) {
            this.id = id;
            this.members = members;
            this.size = size;
            this.internalEdgeCount = internalEdgeCount;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public List<Integer> getMembers() {
            return members;
        }

        public void setMembers(List<Integer> members) {
            this.members = members;
        }

        public int getSize() {
            return size;
        }

        public void setSize(int size) {
            this.size = size;
        }

        public int getInternalEdgeCount() {
            return internalEdgeCount;
        }

        public void setInternalEdgeCount(int internalEdgeCount) {
            this.internalEdgeCount = internalEdgeCount;
        }
    }
}
