import { fetchClient } from './client';

export interface BackendUser {
  id: number;
  name: string;
}

export interface CreateUserPayload {
  id: number;
  name: string;
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
};
