import type {
  User,
  Connection,
  Community,
  PathResult,
  BfsTraversalResult,
  DfsTraversalResult,
  BfsLevel,
  Suggestion,
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
 * Sprint 3A — Unweighted BFS Shortest Path
 */
export function bfsShortestPath(
  users: User[],
  connections: Connection[],
  sourceId: string,
  targetId: string
): PathResult {
  const { adj, userMap } = buildAdjacencyList(users, connections);
  const src = userMap.get(sourceId);
  const tgt = userMap.get(targetId);

  if (!src || !tgt) {
    return {
      sourceUser: src!,
      targetUser: tgt!,
      path: [],
      pathLength: 0,
      degreesOfSeparation: 0,
      found: false
    };
  }

  if (sourceId === targetId) {
    return {
      sourceUser: src,
      targetUser: tgt,
      path: [src],
      pathLength: 0,
      degreesOfSeparation: 0,
      found: true
    };
  }

  const queue: string[][] = [[sourceId]];
  const visited = new Set<string>([sourceId]);

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const lastNode = currentPath[currentPath.length - 1];

    if (lastNode === targetId) {
      const fullUserPath = currentPath.map(id => userMap.get(id)!).filter(Boolean);
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

    const neighbors = adj.get(lastNode) || [];
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
}

/**
 * Sprint 3B — BFS Traversal by Depth/Level
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
 * Sprint 3C — Iterative DFS Traversal using Explicit Stack
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
 * Sprint 4 — Real Connected Components Detection Algorithm
 */
export function findConnectedComponents(
  users: User[],
  connections: Connection[]
): Community[] {
  if (users.length === 0) return [];

  const { adj, userMap } = buildAdjacencyList(users, connections);
  const visited = new Set<string>();
  const rawComponents: string[][] = [];

  users.forEach(user => {
    if (!visited.has(user.id)) {
      const componentMembers: string[] = [];
      const queue: string[] = [user.id];
      visited.add(user.id);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        componentMembers.push(curr);

        const neighbors = adj.get(curr) || [];
        neighbors.forEach(n => {
          if (!visited.has(n)) {
            visited.add(n);
            queue.push(n);
          }
        });
      }
      rawComponents.push(componentMembers);
    }
  });

  // Sort components by size descending, then by lowest numeric ID ascending
  rawComponents.sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length;
    const minA = Math.min(...a.map(id => parseInt(id, 10) || 0));
    const minB = Math.min(...b.map(id => parseInt(id, 10) || 0));
    return minA - minB;
  });

  const MONOCHROME_PALETTE = ['#ffffff', '#e4e4e7', '#a1a1aa', '#71717a', '#52525b', '#3f3f46'];

  return rawComponents.map((memberIds, idx) => {
    const memberSet = new Set(memberIds);
    const compUsers = memberIds.map(id => userMap.get(id)!).filter(Boolean);

    // Count internal edges within this component
    let internalEdges = 0;
    connections.forEach(c => {
      if (memberSet.has(c.sourceUserId) && memberSet.has(c.targetUserId)) {
        internalEdges++;
      }
    });

    const memberCount = compUsers.length;
    const density =
      memberCount > 1
        ? parseFloat(((2 * internalEdges) / (memberCount * (memberCount - 1))).toFixed(3))
        : 0;

    // Find highest degree user in this component
    const topUser = [...compUsers].sort((a, b) => b.connectionCount - a.connectionCount)[0];
    const mostConnectedName = topUser ? topUser.name : 'N/A';

    const commId = `c_${idx + 1}`;
    const name = memberCount === 1 ? `Isolated Cluster #${idx + 1}` : `Cluster #${idx + 1}`;

    return {
      id: commId,
      name,
      color: MONOCHROME_PALETTE[idx % MONOCHROME_PALETTE.length],
      bgGlow: 'rgba(255, 255, 255, 0.08)',
      memberCount,
      connectionCount: internalEdges,
      density,
      mostConnectedMember: mostConnectedName,
      description:
        memberCount === 1
          ? `Single isolated user node (${compUsers[0]?.name || 'User'}).`
          : `Connected component of ${memberCount} user nodes with ${internalEdges} internal friendship edges.`,
      memberIds
    };
  });
}

/**
 * Sprint 5 — Mutual Connections & Friends-of-Friends Recommendations
 */
export function getSuggestions(
  users: User[],
  connections: Connection[],
  userId: string
): Suggestion[] {
  const { adj, userMap } = buildAdjacencyList(users, connections);
  const targetUser = userMap.get(userId);
  if (!targetUser) return [];

  const directFriends = new Set(adj.get(userId) || []);
  const candidatesMap = new Map<string, string[]>(); // candidateId -> mutualFriendIds

  // Friends of friends candidate collection
  directFriends.forEach(friendId => {
    const friendsOfFriend = adj.get(friendId) || [];
    friendsOfFriend.forEach(candId => {
      // Exclude self and direct friends
      if (candId !== userId && !directFriends.has(candId)) {
        if (!candidatesMap.has(candId)) {
          candidatesMap.set(candId, []);
        }
        candidatesMap.get(candId)!.push(friendId);
      }
    });
  });

  const candidates = Array.from(candidatesMap.entries()).map(([candId, mutualFriendIds]) => {
    const user = userMap.get(candId)!;
    const uniqueMutuals = Array.from(new Set(mutualFriendIds));
    const mutualSampleNames = uniqueMutuals.map(id => userMap.get(id)?.name || id);

    // Compute grounded match percentage
    const maxPossible = Math.max(1, directFriends.size);
    const confidenceScore = Math.min(99, Math.round((uniqueMutuals.length / maxPossible) * 100));

    return {
      id: `sugg_${userId}_${candId}`,
      user,
      mutualConnectionCount: uniqueMutuals.length,
      mutualConnectionsSample: mutualSampleNames,
      sharedCommunity: user.communityName,
      totalConnectionCount: user.connectionCount,
      reason: `${uniqueMutuals.length} mutual connection${uniqueMutuals.length > 1 ? 's' : ''} in network (${mutualSampleNames.slice(0, 2).join(', ')})`,
      confidenceScore
    };
  });

  // Sort candidates by mutual connection count descending, then by numeric ID ascending
  candidates.sort((a, b) => {
    if (b.mutualConnectionCount !== a.mutualConnectionCount) {
      return b.mutualConnectionCount - a.mutualConnectionCount;
    }
    const numA = parseInt(a.user.id, 10) || 0;
    const numB = parseInt(b.user.id, 10) || 0;
    return numA - numB;
  });

  return candidates;
}

/**
 * Sprint 6 — Shared Graph Network Analytics Calculator
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
