import type {
  User,
  Connection,
  Community,
  BfsTraversalResult,
  DfsTraversalResult,
  BfsLevel,
  NetworkAnalytics
} from '../types';

/**
 * Builds an undirected adjacency list map and user lookup map.
 * Symmetric: adds both (source -> target) and (target -> source).
 */
export function buildAdjacencyList(users: User[], connections: Connection[]) {
  const userMap = new Map<string, User>();
  users.forEach(u => userMap.set(u.id, u));

  const adj = new Map<string, string[]>();
  users.forEach(u => adj.set(u.id, []));

  connections.forEach(c => {
    if (adj.has(c.sourceUserId)) {
      adj.get(c.sourceUserId)!.push(c.targetUserId);
    }
    if (adj.has(c.targetUserId)) {
      adj.get(c.targetUserId)!.push(c.sourceUserId);
    }
  });

  return { adj, userMap };
}

/**
 * Sprint 3B — Educational BFS Traversal by Depth/Level
 * Retained frontend-side for level-by-level traversal visualization.
 */
export function bfsTraversal(
  users: User[],
  connections: Connection[],
  startId: string
): BfsTraversalResult {
  const { adj, userMap } = buildAdjacencyList(users, connections);
  const startUser = userMap.get(startId) || null;

  if (!startUser) {
    return {
      startId,
      startUser: null,
      visitedOrder: [],
      levels: [],
      totalVisited: 0
    };
  }

  const visited = new Set<string>([startId]);
  const visitedOrder: User[] = [startUser];
  const levels: BfsLevel[] = [{ depth: 0, nodes: [startUser] }];

  let currentLevelNodes: string[] = [startId];
  let depth = 0;

  while (currentLevelNodes.length > 0) {
    const nextLevelNodes: string[] = [];

    for (const node of currentLevelNodes) {
      const neighbors = adj.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          const neighborUser = userMap.get(neighbor);
          if (neighborUser) {
            visitedOrder.push(neighborUser);
            nextLevelNodes.push(neighbor);
          }
        }
      }
    }

    if (nextLevelNodes.length > 0) {
      depth++;
      const levelUsers = nextLevelNodes.map(id => userMap.get(id)!).filter(Boolean);
      levels.push({ depth, nodes: levelUsers });
    }

    currentLevelNodes = nextLevelNodes;
  }

  return {
    startId,
    startUser,
    visitedOrder,
    levels,
    totalVisited: visitedOrder.length
  };
}

/**
 * Sprint 3C — Educational Iterative DFS Traversal using Explicit Stack
 * Retained frontend-side for stack sequence visualization.
 */
export function dfsTraversal(
  users: User[],
  connections: Connection[],
  startId: string
): DfsTraversalResult {
  const { adj, userMap } = buildAdjacencyList(users, connections);
  const startUser = userMap.get(startId) || null;

  if (!startUser) {
    return {
      startId,
      startUser: null,
      visitedOrder: [],
      totalVisited: 0
    };
  }

  const visited = new Set<string>();
  const visitedOrder: User[] = [];
  const stack: string[] = [startId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    if (!visited.has(currentId)) {
      visited.add(currentId);
      const user = userMap.get(currentId);
      if (user) {
        visitedOrder.push(user);
      }

      const neighbors = adj.get(currentId) || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }

  return {
    startId,
    startUser,
    visitedOrder,
    totalVisited: visitedOrder.length
  };
}

/**
 * Sprint 6 — Shared Graph Network Analytics Calculator
 * Derives presentation stats (averages, densities, degree histogram) from graph snapshot.
 */
export function computeNetworkAnalytics(
  users: User[],
  connections: Connection[],
  communities: Community[]
): NetworkAnalytics {
  const totalUsers = users.length;
  const totalConnections = connections.length;

  const avgDegree = totalUsers > 0 ? parseFloat(((2 * totalConnections) / totalUsers).toFixed(2)) : 0;
  const graphDensity =
    totalUsers > 1
      ? parseFloat(((2 * totalConnections) / (totalUsers * (totalUsers - 1))).toFixed(3))
      : 0;

  const sortedUsers = [...users].sort((a, b) => b.connectionCount - a.connectionCount);
  const mostConnectedUser = sortedUsers[0] || null;
  const maxDegree = mostConnectedUser ? mostConnectedUser.connectionCount : 0;

  const isolatedUserCount = users.filter(u => u.connectionCount === 0).length;

  // Degree Distribution Histogram
  const degreeMap = new Map<number, number>();
  users.forEach(u => {
    degreeMap.set(u.connectionCount, (degreeMap.get(u.connectionCount) || 0) + 1);
  });

  const degreeDistribution = Array.from(degreeMap.entries())
    .map(([degree, count]) => ({ degree, count }))
    .sort((a, b) => a.degree - b.degree);

  return {
    totalUsers,
    totalConnections,
    avgDegree,
    maxDegree,
    mostConnectedUser,
    totalCommunities: communities.length,
    largestCommunitySize: Math.max(...communities.map(c => c.memberCount), 0),
    isolatedUserCount,
    graphDensity,
    degreeDistribution
  };
}
