import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Connection, Community, ToastMessage, PathResult } from '../types';
import { INITIAL_USERS, INITIAL_CONNECTIONS, MOCK_COMMUNITIES } from '../data/mockData';

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
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  nodeLabelsVisible: boolean;
  setNodeLabelsVisible: (visible: boolean) => void;
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  addUser: (user: Omit<User, 'id' | 'connectionCount' | 'degreeCentrality' | 'status' | 'joinedDate'>) => void;
  addConnection: (sourceId: string, targetId: string, type: Connection['connectionType']) => void;
  deleteConnection: (connectionId: string) => void;
  findPath: (sourceId: string, targetId: string) => PathResult;
  getUserById: (id: string) => User | undefined;
  getMutualConnections: (user1Id: string, user2Id: string) => User[];
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export const GraphProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);
  const [communities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('u1'); // Default select Alex Mercer
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [communityFilter, setCommunityFilter] = useState<string>('all');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [nodeLabelsVisible, setNodeLabelsVisible] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark / Light Theme Sync
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
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

  const getUserById = (id: string) => users.find(u => u.id === id);

  const addUser = (userData: Omit<User, 'id' | 'connectionCount' | 'degreeCentrality' | 'status' | 'joinedDate'>) => {
    const newId = `u${users.length + 1}`;
    const newUser: User = {
      ...userData,
      id: newId,
      connectionCount: 0,
      degreeCentrality: 0.1,
      status: 'online',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);
    addToast('User Added', `${newUser.name} (@${newUser.username}) has been added to the graph.`, 'success');
  };

  const addConnection = (sourceId: string, targetId: string, type: Connection['connectionType']) => {
    const u1 = getUserById(sourceId);
    const u2 = getUserById(targetId);
    if (!u1 || !u2) return;

    // Check existing
    const exists = connections.some(
      c => (c.sourceUserId === sourceId && c.targetUserId === targetId) ||
           (c.sourceUserId === targetId && c.targetUserId === sourceId)
    );

    if (exists) {
      addToast('Connection Exists', `A connection between ${u1.name} and ${u2.name} already exists.`, 'warning');
      return;
    }

    const newConnection: Connection = {
      id: `e${connections.length + 100}`,
      sourceUserId: sourceId,
      targetUserId: targetId,
      sourceUserName: u1.name,
      targetUserName: u2.name,
      sourceUserAvatar: u1.avatar,
      targetUserAvatar: u2.avatar,
      connectionType: type,
      status: 'Active',
      connectedSince: new Date().toISOString().split('T')[0],
      strength: 4
    };

    setConnections(prev => [newConnection, ...prev]);

    // Update connection counts
    setUsers(prev => prev.map(u => {
      if (u.id === sourceId || u.id === targetId) {
        return { ...u, connectionCount: u.connectionCount + 1 };
      }
      return u;
    }));

    addToast('Connection Created', `${u1.name} and ${u2.name} are now connected.`, 'success');
  };

  const deleteConnection = (connectionId: string) => {
    const conn = connections.find(c => c.id === connectionId);
    if (!conn) return;

    setConnections(prev => prev.filter(c => c.id !== connectionId));

    // Update user connection counts
    setUsers(prev => prev.map(u => {
      if (u.id === conn.sourceUserId || u.id === conn.targetUserId) {
        return { ...u, connectionCount: Math.max(0, u.connectionCount - 1) };
      }
      return u;
    }));

    addToast('Connection Removed', `Connection between ${conn.sourceUserName} and ${conn.targetUserName} deleted.`, 'info');
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

  // Mock BFS / Path finding resolver based on static connections graph
  const findPath = (sourceId: string, targetId: string): PathResult => {
    const src = getUserById(sourceId);
    const tgt = getUserById(targetId);

    if (!src || !tgt) {
      return { sourceUser: src!, targetUser: tgt!, path: [], pathLength: 0, degreesOfSeparation: 0, found: false };
    }

    if (sourceId === targetId) {
      return { sourceUser: src, targetUser: tgt, path: [src], pathLength: 0, degreesOfSeparation: 0, found: true };
    }

    // Build adjacency list
    const adj: { [key: string]: string[] } = {};
    users.forEach(u => { adj[u.id] = []; });
    connections.forEach(c => {
      if (adj[c.sourceUserId]) adj[c.sourceUserId].push(c.targetUserId);
      if (adj[c.targetUserId]) adj[c.targetUserId].push(c.sourceUserId);
    });

    // Simple BFS for shortest path in mock graph
    const queue: string[][] = [[sourceId]];
    const visited = new Set<string>([sourceId]);

    while (queue.length > 0) {
      const currentPath = queue.shift()!;
      const lastNode = currentPath[currentPath.length - 1];

      if (lastNode === targetId) {
        const fullUserPath = currentPath.map(id => getUserById(id)!);
        const pathLength = currentPath.length - 1;
        return {
          sourceUser: src,
          targetUser: tgt,
          path: fullUserPath,
          pathLength,
          degreesOfSeparation: pathLength,
          found: true
        };
      }

      const neighbors = adj[lastNode] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...currentPath, neighbor]);
        }
      }
    }

    return {
      sourceUser: src,
      targetUser: tgt,
      path: [],
      pathLength: 0,
      degreesOfSeparation: 0,
      found: false
    };
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
        theme,
        toggleTheme,
        nodeLabelsVisible,
        setNodeLabelsVisible,
        toasts,
        addToast,
        removeToast,
        addUser,
        addConnection,
        deleteConnection,
        findPath,
        getUserById,
        getMutualConnections
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
