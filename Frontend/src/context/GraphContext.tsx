import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User, Connection, Community, ToastMessage, PathResult } from '../types';
import { userApi } from '../api/userApi';
import { connectionApi } from '../api/connectionApi';
import { bfsShortestPath, findConnectedComponents } from '../utils/graphAlgorithms';

interface GraphContextType {
  users: User[];
  connections: Connection[];
  communities: Community[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  highlightedPath: string[];
  setHighlightedPath: (path: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  communityFilter: string;
  setCommunityFilter: (filter: string) => void;
  nodeLabelsVisible: boolean;
  setNodeLabelsVisible: (visible: boolean) => void;
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  usersLoading: boolean;
  connectionsLoading: boolean;
  usersError: string | null;
  connectionsError: string | null;
  refetchData: () => Promise<void>;
  addUser: (id: number, name: string) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  addConnection: (sourceId: string, targetId: string, type?: Connection['connectionType']) => Promise<boolean>;
  deleteConnection: (connectionId: string) => Promise<boolean>;
  getUserById: (id: string) => User | undefined;
  getMutualConnections: (user1Id: string, user2Id: string) => User[];
  findPath: (sourceId: string, targetId: string) => PathResult;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

function transformUser(
  backendUser: { id: number; name: string },
  connectionCount: number,
  totalUsers: number
): User {
  const numericId = backendUser.id;
  const strId = String(numericId);

  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250'
  ];

  const roles = [
    'Systems Architect',
    'Senior Software Engineer',
    'Data Scientist',
    'Product Designer',
    'Growth Engineer',
    'DevOps Lead'
  ];

  const locations = [
    'San Francisco, CA',
    'Seattle, WA',
    'Austin, TX',
    'New York, NY',
    'Boston, MA',
    'Chicago, IL'
  ];

  const absId = Math.abs(numericId);
  const avatar = avatars[absId % avatars.length];
  const role = roles[absId % roles.length];
  const location = locations[absId % locations.length];

  const sanitized = backendUser.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const username = `@${sanitized || 'user'}_${numericId}`;
  const email = `${sanitized || 'user'}${numericId}@network.io`;
  const status: User['status'] = (absId % 3 === 0) ? 'online' : (absId % 3 === 1) ? 'away' : 'offline';
  const degreeCentrality = totalUsers > 1 ? Number((connectionCount / (totalUsers - 1)).toFixed(2)) : 0;

  return {
    id: strId,
    name: backendUser.name,
    username,
    email,
    avatar,
    role,
    // Real connected component IDs assigned dynamically after component detection
    communityId: 'c_1',
    communityName: 'Cluster #1',
    connectionCount,
    degreeCentrality,
    status,
    joinedDate: '2025-01-15',
    location
  };
}

function transformEdge(edge: { source: number; target: number }, userMap: Map<string, User>): Connection {
  const srcId = String(edge.source);
  const tgtId = String(edge.target);
  const u1 = userMap.get(srcId);
  const u2 = userMap.get(tgtId);

  const types: Connection['connectionType'][] = ['Colleague', 'Friend', 'Collaborator', 'Mentor'];
  const typeIdx = Math.abs(edge.source + edge.target) % types.length;
  const connectionType = types[typeIdx];

  return {
    id: `e_${edge.source}_${edge.target}`,
    sourceUserId: srcId,
    targetUserId: tgtId,
    sourceUserName: u1 ? u1.name : `User ${edge.source}`,
    targetUserName: u2 ? u2.name : `User ${edge.target}`,
    sourceUserAvatar: u1 ? u1.avatar : '',
    targetUserAvatar: u2 ? u2.avatar : '',
    connectionType,
    status: 'Active',
    connectedSince: '2025-01-20',
    strength: 1 + (Math.abs(edge.source + edge.target) % 5)
  };
}

export const GraphProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawUsers, setRawUsers] = useState<User[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [communityFilter, setCommunityFilter] = useState<string>('all');
  const [nodeLabelsVisible, setNodeLabelsVisible] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [usersLoading, setUsersLoading] = useState<boolean>(true);
  const [connectionsLoading, setConnectionsLoading] = useState<boolean>(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [connectionsError, setConnectionsError] = useState<string | null>(null);

  // Sprint 4 — Real Memoized Connected Components (Communities)
  const communities = useMemo(() => {
    return findConnectedComponents(rawUsers, connections);
  }, [rawUsers, connections]);

  // Sprint 4 — Enriched users with real connected component IDs and names
  const users = useMemo(() => {
    const compMap = new Map<string, { id: string; name: string }>();
    communities.forEach(c => {
      c.memberIds.forEach(mId => {
        compMap.set(mId, { id: c.id, name: c.name });
      });
    });

    return rawUsers.map(u => {
      const comp = compMap.get(u.id);
      return {
        ...u,
        communityId: comp ? comp.id : 'c_1',
        communityName: comp ? comp.name : 'Cluster #1'
      };
    });
  }, [rawUsers, communities]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refetchData = useCallback(async () => {
    setUsersLoading(true);
    setConnectionsLoading(true);
    setUsersError(null);
    setConnectionsError(null);

    try {
      const graphData = await connectionApi.getGraph();

      const connectionCountMap = new Map<number, number>();
      graphData.nodes.forEach(node => connectionCountMap.set(node.id, 0));
      graphData.edges.forEach(edge => {
        connectionCountMap.set(edge.source, (connectionCountMap.get(edge.source) || 0) + 1);
        connectionCountMap.set(edge.target, (connectionCountMap.get(edge.target) || 0) + 1);
      });

      const transformedUsers = graphData.nodes.map(node =>
        transformUser(node, connectionCountMap.get(node.id) || 0, graphData.nodes.length)
      );

      const userMap = new Map<string, User>();
      transformedUsers.forEach(u => userMap.set(u.id, u));

      const transformedConnections = graphData.edges.map(edge => transformEdge(edge, userMap));

      setRawUsers(transformedUsers);
      setConnections(transformedConnections);

      if (transformedUsers.length > 0) {
        setSelectedNodeId(prev => (prev && userMap.has(prev) ? prev : transformedUsers[0].id));
      } else {
        setSelectedNodeId(null);
      }
    } catch (err: any) {
      const msg = err?.message || 'Unable to connect to the server. Make sure the Spring Boot backend is running on http://localhost:8080.';
      setUsersError(msg);
      setConnectionsError(msg);
    } finally {
      setUsersLoading(false);
      setConnectionsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchData();
  }, [refetchData]);

  const getUserById = (id: string) => users.find(u => u.id === id);

  const addUser = async (id: number, name: string): Promise<boolean> => {
    try {
      await userApi.createUser({ id, name });
      addToast('User Created', `${name} (ID: ${id}) has been added to the graph.`, 'success');
      await refetchData();
      return true;
    } catch (err: any) {
      const status = err?.status;
      const msg = err?.message || 'Failed to create user.';
      if (status === 409) {
        addToast('Duplicate User ID', `User ID ${id} already exists in the graph.`, 'error');
      } else if (status === 400) {
        addToast('Invalid Input', msg, 'error');
      } else {
        addToast('Failed to Add User', msg, 'error');
      }
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    const numId = parseInt(userId, 10);
    if (isNaN(numId)) {
      addToast('Error', 'Invalid numeric user ID', 'error');
      return false;
    }

    try {
      await userApi.deleteUser(numId);
      addToast('User Deleted', `User node #${userId} was deleted from graph store.`, 'info');
      await refetchData();
      return true;
    } catch (err: any) {
      const msg = err?.message || 'Failed to delete user.';
      addToast('Failed to Delete User', msg, 'error');
      return false;
    }
  };

  const addConnection = async (
    sourceId: string,
    targetId: string,
    _type: Connection['connectionType'] = 'Colleague'
  ): Promise<boolean> => {
    const numSource = parseInt(sourceId, 10);
    const numTarget = parseInt(targetId, 10);
    const u1 = getUserById(sourceId);
    const u2 = getUserById(targetId);
    const u1Name = u1 ? u1.name : `ID ${sourceId}`;
    const u2Name = u2 ? u2.name : `ID ${targetId}`;

    if (numSource === numTarget) {
      addToast('Invalid Connection', 'Cannot create a friendship between a user and themselves', 'error');
      return false;
    }

    const exists = connections.some(
      c => (c.sourceUserId === sourceId && c.targetUserId === targetId) ||
           (c.sourceUserId === targetId && c.targetUserId === sourceId)
    );
    if (exists) {
      addToast('Connection Exists', `Friendship between ${sourceId} and ${targetId} already exists`, 'warning');
      return false;
    }

    try {
      await connectionApi.createFriendship(numSource, numTarget);
      addToast('Connection Created', `${u1Name} and ${u2Name} are now connected.`, 'success');
      await refetchData();
      return true;
    } catch (err: any) {
      const status = err?.status;
      const msg = err?.message || 'Failed to create friendship.';
      if (status === 409) {
        addToast('Connection Exists', msg, 'warning');
      } else if (status === 404) {
        addToast('User Not Found', msg, 'error');
      } else if (status === 400) {
        addToast('Invalid Connection', msg, 'error');
      } else {
        addToast('Failed to Add Connection', msg, 'error');
      }
      return false;
    }
  };

  const deleteConnection = async (connectionId: string): Promise<boolean> => {
    const conn = connections.find(c => c.id === connectionId);
    let numSource: number;
    let numTarget: number;

    if (conn) {
      numSource = parseInt(conn.sourceUserId, 10);
      numTarget = parseInt(conn.targetUserId, 10);
    } else {
      const parts = connectionId.split('_');
      if (parts.length === 3) {
        numSource = parseInt(parts[1], 10);
        numTarget = parseInt(parts[2], 10);
      } else {
        addToast('Error', 'Invalid connection ID format', 'error');
        return false;
      }
    }

    try {
      await connectionApi.deleteFriendship(numSource, numTarget);
      addToast('Connection Deleted', 'Friendship edge removed successfully.', 'info');
      await refetchData();
      return true;
    } catch (err: any) {
      const msg = err?.message || 'Failed to delete friendship.';
      addToast('Failed to Delete Connection', msg, 'error');
      return false;
    }
  };

  const getMutualConnections = (user1Id: string, user2Id: string): User[] => {
    const neighbors1 = connections
      .filter(c => c.sourceUserId === user1Id || c.targetUserId === user1Id)
      .map(c => (c.sourceUserId === user1Id ? c.targetUserId : c.sourceUserId));

    const neighbors2 = connections
      .filter(c => c.sourceUserId === user2Id || c.targetUserId === user2Id)
      .map(c => (c.sourceUserId === user2Id ? c.targetUserId : c.sourceUserId));

    const mutualIds = neighbors1.filter(id => neighbors2.includes(id));
    return users.filter(u => mutualIds.includes(u.id));
  };

  const findPath = (sourceId: string, targetId: string): PathResult => {
    return bfsShortestPath(users, connections, sourceId, targetId);
  };

  return (
    <GraphContext.Provider
      value={{
        users,
        connections,
        communities,
        selectedNodeId,
        setSelectedNodeId,
        highlightedPath,
        setHighlightedPath,
        searchTerm,
        setSearchTerm,
        communityFilter,
        setCommunityFilter,
        nodeLabelsVisible,
        setNodeLabelsVisible,
        toasts,
        addToast,
        removeToast,
        theme,
        toggleTheme,
        usersLoading,
        connectionsLoading,
        usersError,
        connectionsError,
        refetchData,
        addUser,
        deleteUser,
        addConnection,
        deleteConnection,
        getUserById,
        getMutualConnections,
        findPath
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
};
