import { fetchClient } from './client';

export interface BackendUser {
  id: number;
  name: string;
}

export interface CreateUserPayload {
  id: number;
  name: string;
}

export interface BackendSuggestion {
  userId: number;
  name: string;
  mutualFriendCount: number;
  mutualFriends: number[];
}

export interface BackendMutualFriends {
  userId1: number;
  userId2: number;
  mutualFriends: number[];
  count: number;
}

export const userApi = {
  getUsers: async (): Promise<BackendUser[]> => {
    return fetchClient<BackendUser[]>('/api/users');
  },

  createUser: async (payload: CreateUserPayload): Promise<BackendUser> => {
    return fetchClient<BackendUser>('/api/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  deleteUser: async (id: number): Promise<void> => {
    return fetchClient<void>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },

  getUserFriends: async (id: number): Promise<number[]> => {
    return fetchClient<number[]>(`/api/users/${id}/friends`);
  },

  getSuggestions: async (userId: number): Promise<BackendSuggestion[]> => {
    return fetchClient<BackendSuggestion[]>(`/api/users/${userId}/suggestions`);
  },

  getMutualFriends: async (userId: number, otherId: number): Promise<BackendMutualFriends> => {
    return fetchClient<BackendMutualFriends>(`/api/users/${userId}/mutual-friends/${otherId}`);
  }
};
