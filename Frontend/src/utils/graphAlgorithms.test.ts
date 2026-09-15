import { describe, it, expect } from 'vitest';
import type { User, Connection } from '../types';
import {
  bfsTraversal,
  dfsTraversal,
  computeNetworkAnalytics
} from './graphAlgorithms';

function makeUser(id: string, name: string): User {
  return {
    id,
    name,
    username: `@${name.toLowerCase()}_${id}`,
    email: `${name.toLowerCase()}${id}@network.io`,
    avatar: 'http://example.com/avatar.jpg',
    role: 'Engineer',
    communityId: 'c_1',
    communityName: 'Cluster #1',
    connectionCount: 0,
    degreeCentrality: 0,
    status: 'online',
    joinedDate: '2025-01-15',
    location: 'San Francisco, CA'
  };
}

function makeConnection(sourceId: string, targetId: string): Connection {
  return {
    id: `e_${sourceId}_${targetId}`,
    sourceUserId: sourceId,
    targetUserId: targetId,
    sourceUserName: `User ${sourceId}`,
    targetUserName: `User ${targetId}`,
    sourceUserAvatar: '',
    targetUserAvatar: '',
    connectionType: 'Friend',
    status: 'Active',
    connectedSince: '2025-01-20',
    strength: 1
  };
}

describe('Retained Frontend Graph Utilities', () => {
  describe('bfsTraversal', () => {
    it('traverses single node graph', () => {
      const u1 = makeUser('1', 'Alice');
      const res = bfsTraversal([u1], [], '1');
      expect(res.totalVisited).toBe(1);
      expect(res.levels.length).toBe(1);
      expect(res.levels[0].nodes[0].id).toBe('1');
    });

    it('groups nodes level-by-level correctly', () => {
      const u1 = makeUser('1', 'Alice');
      const u2 = makeUser('2', 'Bob');
      const u3 = makeUser('3', 'Charlie');
      const u4 = makeUser('4', 'David');

      const c1 = makeConnection('1', '2');
      const c2 = makeConnection('1', '3');
      const c3 = makeConnection('2', '4');

      const res = bfsTraversal([u1, u2, u3, u4], [c1, c2, c3], '1');
      expect(res.totalVisited).toBe(4);
      expect(res.levels.length).toBe(3);
      expect(res.levels[0].nodes.map(u => u.id)).toEqual(['1']);
      expect(res.levels[1].nodes.map(u => u.id)).toEqual(['2', '3']);
      expect(res.levels[2].nodes.map(u => u.id)).toEqual(['4']);
    });

    it('handles disconnected component traversal (only reaches reachable nodes)', () => {
      const u1 = makeUser('1', 'Alice');
      const u2 = makeUser('2', 'Bob');
      const u3 = makeUser('3', 'Isolated');
      const c1 = makeConnection('1', '2');

      const res = bfsTraversal([u1, u2, u3], [c1], '1');
      expect(res.totalVisited).toBe(2);
      expect(res.visitedOrder.map(u => u.id)).toEqual(['1', '2']);
    });
  });

  describe('dfsTraversal', () => {
    it('traverses single node graph', () => {
      const u1 = makeUser('1', 'Alice');
      const res = dfsTraversal([u1], [], '1');
      expect(res.totalVisited).toBe(1);
      expect(res.visitedOrder[0].id).toBe('1');
    });

    it('traverses depth-first iteratively without infinite loop on cycles', () => {
      const u1 = makeUser('1', 'Alice');
      const u2 = makeUser('2', 'Bob');
      const u3 = makeUser('3', 'Charlie');
      const c1 = makeConnection('1', '2');
      const c2 = makeConnection('2', '3');
      const c3 = makeConnection('3', '1');

      const res = dfsTraversal([u1, u2, u3], [c1, c2, c3], '1');
      expect(res.totalVisited).toBe(3);
    });
  });

  describe('computeNetworkAnalytics', () => {
    it('handles N=0 without NaN or Infinity', () => {
      const analytics = computeNetworkAnalytics([], [], []);
      expect(analytics.totalUsers).toBe(0);
      expect(analytics.avgDegree).toBe(0);
      expect(analytics.graphDensity).toBe(0);
      expect(analytics.mostConnectedUser).toBeNull();
      expect(Number.isNaN(analytics.avgDegree)).toBe(false);
      expect(Number.isNaN(analytics.graphDensity)).toBe(false);
    });

    it('handles N=1 without NaN or Infinity', () => {
      const u1 = makeUser('1', 'Alice');
      const analytics = computeNetworkAnalytics([u1], [], []);
      expect(analytics.totalUsers).toBe(1);
      expect(analytics.avgDegree).toBe(0);
      expect(analytics.graphDensity).toBe(0);
      expect(analytics.isolatedUserCount).toBe(1);
      expect(Number.isNaN(analytics.graphDensity)).toBe(false);
    });

    it('calculates metrics correctly for N=2 with 1 edge', () => {
      const u1 = { ...makeUser('1', 'Alice'), connectionCount: 1 };
      const u2 = { ...makeUser('2', 'Bob'), connectionCount: 1 };
      const c1 = makeConnection('1', '2');

      const analytics = computeNetworkAnalytics([u1, u2], [c1], []);
      expect(analytics.totalUsers).toBe(2);
      expect(analytics.totalConnections).toBe(1);
      expect(analytics.avgDegree).toBe(1);
      expect(analytics.graphDensity).toBe(1);
      expect(analytics.isolatedUserCount).toBe(0);
    });
  });
});
