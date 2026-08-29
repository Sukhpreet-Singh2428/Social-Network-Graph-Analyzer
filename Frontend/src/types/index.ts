export type CommunityId = string;

export interface Community {
  id: CommunityId;
  name: string;
  color: string;
  bgGlow: string;
  memberCount: number;
  connectionCount: number;
  density: number;
  mostConnectedMember: string;
  description: string;
  memberIds: string[];
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  communityId: CommunityId;
  communityName: string;
  connectionCount: number;
  degreeCentrality: number;
  mutualCount?: number;
  status: 'online' | 'offline' | 'away';
  joinedDate: string;
  location: string;
}

export interface Connection {
  id: string;
  sourceUserId: string;
  targetUserId: string;
  sourceUserName: string;
  targetUserName: string;
  sourceUserAvatar: string;
  targetUserAvatar: string;
  connectionType: 'Friend' | 'Colleague' | 'Mentor' | 'Collaborator';
  status: 'Active' | 'Pending';
  connectedSince: string;
  strength: number; // 1 - 5
}

export interface GraphNode extends User {
  x: number;
  y: number;
  radius: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  strength: number;
}

export interface Suggestion {
  id: string;
  user: User;
  mutualConnectionCount: number;
  mutualConnectionsSample: string[];
  sharedCommunity: string;
  totalConnectionCount: number;
  reason: string;
  confidenceScore: number; // e.g. 94% match
}

export interface PathStep {
  user: User;
  edgeType?: string;
}

export interface PathResult {
  sourceUser: User;
  targetUser: User;
  path: User[];
  pathLength: number; // number of edges
  degreesOfSeparation: number; // number of edges
  found: boolean;
}

export interface BfsLevel {
  depth: number;
  nodes: User[];
}

export interface BfsTraversalResult {
  startId: string;
  startUser: User | null;
  visitedOrder: User[];
  levels: BfsLevel[];
  totalVisited: number;
}

export interface DfsTraversalResult {
  startId: string;
  startUser: User | null;
  visitedOrder: User[];
  totalVisited: number;
}

export interface NetworkAnalytics {
  totalUsers: number;
  totalConnections: number;
  avgDegree: number;
  maxDegree: number;
  mostConnectedUser: User | null;
  totalCommunities: number;
  largestCommunitySize: number;
  isolatedUserCount: number;
  graphDensity: number;
  degreeDistribution: { degree: number; count: number }[];
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  type: 'connection' | 'community' | 'user' | 'system';
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface NetworkStats {
  totalUsers: number;
  totalConnections: number;
  totalCommunities: number;
  avgConnections: number;
  networkDensity: number;
  mostConnectedUser: {
    name: string;
    connections: number;
    avatar: string;
  };
}
