import { fetchClient } from './client';

export interface BackendNode {
  id: number;
  name: string;
}

export interface BackendEdge {
  source: number;
  target: number;
}

export interface BackendGraphResponse {
  nodes: BackendNode[];
  edges: BackendEdge[];
}

export interface FriendshipPayload {
  userId1: number;
  userId2: number;
}

export const connectionApi = {
  getGraph: async (): Promise<BackendGraphResponse> => {
    return fetchClient<BackendGraphResponse>('/api/graph');
  },

  createFriendship: async (userId1: number, userId2: number): Promise<{ message: string; userId1: number; userId2: number }> => {
    return fetchClient<{ message: string; userId1: number; userId2: number }>('/api/friendships', {
      method: 'POST',
      body: JSON.stringify({ userId1, userId2 }),
    });
  },

  deleteFriendship: async (userId1: number, userId2: number): Promise<void> => {
    return fetchClient<void>('/api/friendships', {
      method: 'DELETE',
      body: JSON.stringify({ userId1, userId2 }),
    });
  },
};
