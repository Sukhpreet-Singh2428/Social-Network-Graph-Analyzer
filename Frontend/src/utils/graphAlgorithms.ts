import type { User, Connection, PathResult, BfsTraversalResult, DfsTraversalResult, BfsLevel } from '../types';

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

  // Edge case: source === target
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
      // Push neighbors in reverse order so first neighbor is popped first
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
