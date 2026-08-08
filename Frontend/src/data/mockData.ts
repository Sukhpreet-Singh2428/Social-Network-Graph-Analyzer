import type { User, Connection, Community, ActivityItem, Suggestion, NetworkStats } from '../types';

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'c1',
    name: 'Tech Innovators',
    color: '#ffffff', // White
    bgGlow: 'rgba(255, 255, 255, 0.1)',
    memberCount: 8,
    connectionCount: 16,
    density: 0.57,
    mostConnectedMember: 'Alex Mercer',
    description: 'Engineers, system architects, and tech leads driving core infrastructure.'
  },
  {
    id: 'c2',
    name: 'Data Scientists',
    color: '#a1a1aa', // Silver
    bgGlow: 'rgba(161, 161, 170, 0.1)',
    memberCount: 7,
    connectionCount: 14,
    density: 0.62,
    mostConnectedMember: 'Dr. Elena Rostova',
    description: 'AI researchers, graph algorithmists, and quantitative analysts.'
  },
  {
    id: 'c3',
    name: 'Product Designers',
    color: '#71717a', // Medium Gray
    bgGlow: 'rgba(113, 113, 122, 0.1)',
    memberCount: 6,
    connectionCount: 11,
    density: 0.51,
    mostConnectedMember: 'Sophia Chen',
    description: 'UX architects, visual designers, and interaction strategists.'
  },
  {
    id: 'c4',
    name: 'Growth Engineers',
    color: '#e4e4e7', // Light Gray
    bgGlow: 'rgba(228, 228, 231, 0.1)',
    memberCount: 5,
    connectionCount: 9,
    density: 0.45,
    mostConnectedMember: 'Marcus Vance',
    description: 'Product managers, growth hackers, and ecosystem strategists.'
  }
];

export const INITIAL_USERS: User[] = [
  // Community 1: Tech Innovators
  {
    id: 'u1',
    name: 'Alex Mercer',
    username: '@alex_m',
    email: 'alex.mercer@network.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    role: 'Principal Systems Architect',
    communityId: 'c1',
    communityName: 'Tech Innovators',
    connectionCount: 9,
    degreeCentrality: 0.88,
    status: 'online',
    joinedDate: '2025-01-10',
    location: 'San Francisco, CA'
  },
  {
    id: 'u2',
    name: 'David Kim',
    username: '@dkim_dev',
    email: 'david.kim@network.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    role: 'Senior Backend Engineer',
    communityId: 'c1',
    communityName: 'Tech Innovators',
    connectionCount: 7,
    degreeCentrality: 0.72,
    status: 'online',
    joinedDate: '2025-02-14',
    location: 'Seattle, WA'
  },
  {
    id: 'u3',
    name: 'Carlos Mendez',
    username: '@carlos_m',
    email: 'carlos.m@network.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    role: 'DevOps Lead',
    communityId: 'c1',
    communityName: 'Tech Innovators',
    connectionCount: 5,
    degreeCentrality: 0.54,
    status: 'offline',
    joinedDate: '2025-03-01',
    location: 'Austin, TX'
  },
  {
    id: 'u4',
    name: 'Sarah Jenkins',
    username: '@sjenkins',
    email: 'sarah.j@network.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    role: 'Cloud Architect',
    communityId: 'c1',
    communityName: 'Tech Innovators',
    connectionCount: 6,
    degreeCentrality: 0.61,
    status: 'away',
    joinedDate: '2025-01-22',
    location: 'Boston, MA'
  },
  {
    id: 'u5',
    name: 'Liam Thorne',
    username: '@liam_t',
    email: 'liam.t@network.io',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    role: 'Distributed Systems Engineer',
    communityId: 'c1',
    communityName: 'Tech Innovators',
    connectionCount: 4,
    degreeCentrality: 0.44,
    status: 'online',
    joinedDate: '2025-04-11',
    location: 'Denver, CO'
  },

  // Community 2: Data Scientists
  {
    id: 'u6',
    name: 'Dr. Elena Rostova',
    username: '@elena_ai',
    email: 'elena.rostova@network.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    role: 'Lead Graph Scientist',
    communityId: 'c2',
    communityName: 'Data Scientists',
    connectionCount: 11,
    degreeCentrality: 0.95,
    status: 'online',
    joinedDate: '2025-01-05',
    location: 'New York, NY'
  },
  {
    id: 'u7',
    name: 'Priya Sharma',
    username: '@psharma_data',
    email: 'priya.sharma@network.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    role: 'Machine Learning Engineer',
    communityId: 'c2',
    communityName: 'Data Scientists',
    connectionCount: 8,
    degreeCentrality: 0.78,
    status: 'online',
    joinedDate: '2025-02-01',
    location: 'Chicago, IL'
  },
  {
    id: 'u8',
    name: 'Viktor Nikolov',
    username: '@v_nikolov',
    email: 'viktor.n@network.io',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    role: 'Bioinformatics Analyst',
    communityId: 'c2',
    communityName: 'Data Scientists',
    connectionCount: 5,
    degreeCentrality: 0.50,
    status: 'offline',
    joinedDate: '2025-03-15',
    location: 'Toronto, Canada'
  },
  {
    id: 'u9',
    name: 'Maya Patel',
    username: '@mpatel_stats',
    email: 'maya.patel@network.io',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    role: 'Quantitative Researcher',
    communityId: 'c2',
    communityName: 'Data Scientists',
    connectionCount: 6,
    degreeCentrality: 0.59,
    status: 'online',
    joinedDate: '2025-02-28',
    location: 'London, UK'
  },

  // Community 3: Product Designers
  {
    id: 'u10',
    name: 'Sophia Chen',
    username: '@sophia_ux',
    email: 'sophia.chen@network.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    role: 'VP of Product Design',
    communityId: 'c3',
    communityName: 'Product Designers',
    connectionCount: 10,
    degreeCentrality: 0.91,
    status: 'online',
    joinedDate: '2025-01-12',
    location: 'Los Angeles, CA'
  },
  {
    id: 'u11',
    name: 'Lucas Dupont',
    username: '@ldupont_ui',
    email: 'lucas.d@network.io',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    role: 'Design Systems Lead',
    communityId: 'c3',
    communityName: 'Product Designers',
    connectionCount: 7,
    degreeCentrality: 0.68,
    status: 'away',
    joinedDate: '2025-02-18',
    location: 'Paris, France'
  },
  {
    id: 'u12',
    name: 'Emma Watson',
    username: '@em_des',
    email: 'emma.w@network.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    role: 'Interaction Designer',
    communityId: 'c3',
    communityName: 'Product Designers',
    connectionCount: 5,
    degreeCentrality: 0.49,
    status: 'online',
    joinedDate: '2025-03-10',
    location: 'Berlin, Germany'
  },
  {
    id: 'u13',
    name: 'Kenji Sato',
    username: '@kenji_sato',
    email: 'kenji.sato@network.io',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    role: 'User Researcher',
    communityId: 'c3',
    communityName: 'Product Designers',
    connectionCount: 6,
    degreeCentrality: 0.58,
    status: 'online',
    joinedDate: '2025-02-05',
    location: 'Tokyo, Japan'
  },

  // Community 4: Growth Engineers
  {
    id: 'u14',
    name: 'Marcus Vance',
    username: '@marcus_v',
    email: 'marcus.vance@network.io',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=250',
    role: 'Head of Growth',
    communityId: 'c4',
    communityName: 'Growth Engineers',
    connectionCount: 8,
    degreeCentrality: 0.81,
    status: 'online',
    joinedDate: '2025-01-15',
    location: 'Miami, FL'
  },
  {
    id: 'u15',
    name: 'Chloe Bennett',
    username: '@chloe_growth',
    email: 'chloe.b@network.io',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250',
    role: 'Ecosystem Strategist',
    communityId: 'c4',
    communityName: 'Growth Engineers',
    connectionCount: 6,
    degreeCentrality: 0.63,
    status: 'online',
    joinedDate: '2025-02-22',
    location: 'San Diego, CA'
  },
  {
    id: 'u16',
    name: 'Zaid Al-Mansoor',
    username: '@zaid_m',
    email: 'zaid.al@network.io',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=250',
    role: 'Product Analytics Lead',
    communityId: 'c4',
    communityName: 'Growth Engineers',
    connectionCount: 5,
    degreeCentrality: 0.52,
    status: 'offline',
    joinedDate: '2025-03-05',
    location: 'Dubai, UAE'
  },

  // Cross-Community Connectors
  {
    id: 'u17',
    name: 'Hannah Abbott',
    username: '@habbott',
    email: 'hannah.a@network.io',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
    role: 'Frontend Architect',
    communityId: 'c1',
    communityName: 'Tech Innovators',
    connectionCount: 7,
    degreeCentrality: 0.70,
    status: 'online',
    joinedDate: '2025-01-30',
    location: 'Portland, OR'
  },
  {
    id: 'u18',
    name: 'Gabriel Silva',
    username: '@g_silva',
    email: 'gabriel.s@network.io',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=250',
    role: 'MLOps Architect',
    communityId: 'c2',
    communityName: 'Data Scientists',
    connectionCount: 6,
    degreeCentrality: 0.65,
    status: 'away',
    joinedDate: '2025-02-12',
    location: 'Sao Paulo, Brazil'
  },
  {
    id: 'u19',
    name: 'Nina Kowalski',
    username: '@nina_k',
    email: 'nina.k@network.io',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=250',
    role: 'Design Technologist',
    communityId: 'c3',
    communityName: 'Product Designers',
    connectionCount: 6,
    degreeCentrality: 0.60,
    status: 'online',
    joinedDate: '2025-03-20',
    location: 'Warsaw, Poland'
  },
  {
    id: 'u20',
    name: 'Tariq O’Connor',
    username: '@tariq_oc',
    email: 'tariq.oc@network.io',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    role: 'Viral Growth Engineer',
    communityId: 'c4',
    communityName: 'Growth Engineers',
    connectionCount: 5,
    degreeCentrality: 0.48,
    status: 'offline',
    joinedDate: '2025-04-02',
    location: 'Dublin, Ireland'
  }
];

export const INITIAL_CONNECTIONS: Connection[] = [
  // Community 1 internal connections
  { id: 'e1', sourceUserId: 'u1', targetUserId: 'u2', sourceUserName: 'Alex Mercer', targetUserName: 'David Kim', sourceUserAvatar: INITIAL_USERS[0].avatar, targetUserAvatar: INITIAL_USERS[1].avatar, connectionType: 'Colleague', status: 'Active', connectedSince: '2025-01-15', strength: 5 },
  { id: 'e2', sourceUserId: 'u1', targetUserId: 'u3', sourceUserName: 'Alex Mercer', targetUserName: 'Carlos Mendez', sourceUserAvatar: INITIAL_USERS[0].avatar, targetUserAvatar: INITIAL_USERS[2].avatar, connectionType: 'Collaborator', status: 'Active', connectedSince: '2025-02-01', strength: 4 },
  { id: 'e3', sourceUserId: 'u1', targetUserId: 'u4', sourceUserName: 'Alex Mercer', targetUserName: 'Sarah Jenkins', sourceUserAvatar: INITIAL_USERS[0].avatar, targetUserAvatar: INITIAL_USERS[3].avatar, connectionType: 'Friend', status: 'Active', connectedSince: '2025-01-25', strength: 5 },
  { id: 'e4', sourceUserId: 'u2', targetUserId: 'u5', sourceUserName: 'David Kim', targetUserName: 'Liam Thorne', sourceUserAvatar: INITIAL_USERS[1].avatar, targetUserAvatar: INITIAL_USERS[4].avatar, connectionType: 'Colleague', status: 'Active', connectedSince: '2025-03-01', strength: 3 },
  { id: 'e5', sourceUserId: 'u3', targetUserId: 'u4', sourceUserName: 'Carlos Mendez', targetUserName: 'Sarah Jenkins', sourceUserAvatar: INITIAL_USERS[2].avatar, targetUserAvatar: INITIAL_USERS[3].avatar, connectionType: 'Colleague', status: 'Active', connectedSince: '2025-02-20', strength: 4 },

  // Community 2 internal connections
  { id: 'e6', sourceUserId: 'u6', targetUserId: 'u7', sourceUserName: 'Dr. Elena Rostova', targetUserName: 'Priya Sharma', sourceUserAvatar: INITIAL_USERS[5].avatar, targetUserAvatar: INITIAL_USERS[6].avatar, connectionType: 'Mentor', status: 'Active', connectedSince: '2025-01-10', strength: 5 },
  { id: 'e7', sourceUserId: 'u6', targetUserId: 'u8', sourceUserName: 'Dr. Elena Rostova', targetUserName: 'Viktor Nikolov', sourceUserAvatar: INITIAL_USERS[5].avatar, targetUserAvatar: INITIAL_USERS[7].avatar, connectionType: 'Collaborator', status: 'Active', connectedSince: '2025-02-05', strength: 4 },
  { id: 'e8', sourceUserId: 'u6', targetUserId: 'u9', sourceUserName: 'Dr. Elena Rostova', targetUserName: 'Maya Patel', sourceUserAvatar: INITIAL_USERS[5].avatar, targetUserAvatar: INITIAL_USERS[8].avatar, connectionType: 'Colleague', status: 'Active', connectedSince: '2025-02-15', strength: 4 },
  { id: 'e9', sourceUserId: 'u7', targetUserId: 'u9', sourceUserName: 'Priya Sharma', targetUserName: 'Maya Patel', sourceUserAvatar: INITIAL_USERS[6].avatar, targetUserAvatar: INITIAL_USERS[8].avatar, connectionType: 'Friend', status: 'Active', connectedSince: '2025-03-05', strength: 5 },

  // Community 3 internal connections
  { id: 'e10', sourceUserId: 'u10', targetUserId: 'u11', sourceUserName: 'Sophia Chen', targetUserName: 'Lucas Dupont', sourceUserAvatar: INITIAL_USERS[9].avatar, targetUserAvatar: INITIAL_USERS[10].avatar, connectionType: 'Colleague', status: 'Active', connectedSince: '2025-01-18', strength: 5 },
  { id: 'e11', sourceUserId: 'u10', targetUserId: 'u12', sourceUserName: 'Sophia Chen', targetUserName: 'Emma Watson', sourceUserAvatar: INITIAL_USERS[9].avatar, targetUserAvatar: INITIAL_USERS[11].avatar, connectionType: 'Mentor', status: 'Active', connectedSince: '2025-02-10', strength: 4 },
  { id: 'e12', sourceUserId: 'u10', targetUserId: 'u13', sourceUserName: 'Sophia Chen', targetUserName: 'Kenji Sato', sourceUserAvatar: INITIAL_USERS[9].avatar, targetUserAvatar: INITIAL_USERS[12].avatar, connectionType: 'Collaborator', status: 'Active', connectedSince: '2025-02-25', strength: 4 },
  { id: 'e13', sourceUserId: 'u11', targetUserId: 'u12', sourceUserName: 'Lucas Dupont', targetUserName: 'Emma Watson', sourceUserAvatar: INITIAL_USERS[10].avatar, targetUserAvatar: INITIAL_USERS[11].avatar, connectionType: 'Friend', status: 'Active', connectedSince: '2025-03-01', strength: 3 },

  // Community 4 internal connections
  { id: 'e14', sourceUserId: 'u14', targetUserId: 'u15', sourceUserName: 'Marcus Vance', targetUserName: 'Chloe Bennett', sourceUserAvatar: INITIAL_USERS[13].avatar, targetUserAvatar: INITIAL_USERS[14].avatar, connectionType: 'Colleague', status: 'Active', connectedSince: '2025-01-20', strength: 5 },
  { id: 'e15', sourceUserId: 'u14', targetUserId: 'u16', sourceUserName: 'Marcus Vance', targetUserName: 'Zaid Al-Mansoor', sourceUserAvatar: INITIAL_USERS[13].avatar, targetUserAvatar: INITIAL_USERS[15].avatar, connectionType: 'Collaborator', status: 'Active', connectedSince: '2025-02-14', strength: 4 },
  { id: 'e16', sourceUserId: 'u15', targetUserId: 'u20', sourceUserName: 'Chloe Bennett', targetUserName: 'Tariq O’Connor', sourceUserAvatar: INITIAL_USERS[14].avatar, targetUserAvatar: INITIAL_USERS[19].avatar, connectionType: 'Friend', status: 'Active', connectedSince: '2025-03-10', strength: 3 },

  // Cross-Community Super-Edges (Core Hub Bridges)
  { id: 'e17', sourceUserId: 'u1', targetUserId: 'u6', sourceUserName: 'Alex Mercer', targetUserName: 'Dr. Elena Rostova', sourceUserAvatar: INITIAL_USERS[0].avatar, targetUserAvatar: INITIAL_USERS[5].avatar, connectionType: 'Collaborator', status: 'Active', connectedSince: '2025-01-08', strength: 5 },
  { id: 'e18', sourceUserId: 'u6', targetUserId: 'u10', sourceUserName: 'Dr. Elena Rostova', targetUserName: 'Sophia Chen', sourceUserAvatar: INITIAL_USERS[5].avatar, targetUserAvatar: INITIAL_USERS[9].avatar, connectionType: 'Friend', status: 'Active', connectedSince: '2025-01-14', strength: 5 },
  { id: 'e19', sourceUserId: 'u10', targetUserId: 'u14', sourceUserName: 'Sophia Chen', targetUserName: 'Marcus Vance', sourceUserAvatar: INITIAL_USERS[9].avatar, targetUserAvatar: INITIAL_USERS[13].avatar, connectionType: 'Colleague', status: 'Active', connectedSince: '2025-01-22', strength: 4 },
  { id: 'e20', sourceUserId: 'u14', targetUserId: 'u1', sourceUserName: 'Marcus Vance', targetUserName: 'Alex Mercer', sourceUserAvatar: INITIAL_USERS[13].avatar, targetUserAvatar: INITIAL_USERS[0].avatar, connectionType: 'Collaborator', status: 'Active', connectedSince: '2025-02-02', strength: 4 },

  // Connectors
  { id: 'e21', sourceUserId: 'u17', targetUserId: 'u1', sourceUserName: 'Hannah Abbott', targetUserName: 'Alex Mercer', sourceUserAvatar: INITIAL_USERS[16].avatar, targetUserAvatar: INITIAL_USERS[0].avatar, connectionType: 'Colleague', status: 'Active', connectedSince: '2025-02-18', strength: 4 },
  { id: 'e22', sourceUserId: 'u17', targetUserId: 'u10', sourceUserName: 'Hannah Abbott', targetUserName: 'Sophia Chen', sourceUserAvatar: INITIAL_USERS[16].avatar, targetUserAvatar: INITIAL_USERS[9].avatar, connectionType: 'Collaborator', status: 'Active', connectedSince: '2025-02-24', strength: 5 },
  { id: 'e23', sourceUserId: 'u18', targetUserId: 'u6', sourceUserName: 'Gabriel Silva', targetUserName: 'Dr. Elena Rostova', sourceUserAvatar: INITIAL_USERS[17].avatar, targetUserAvatar: INITIAL_USERS[5].avatar, connectionType: 'Colleague', status: 'Active', connectedSince: '2025-02-28', strength: 4 },
  { id: 'e24', sourceUserId: 'u18', targetUserId: 'u2', sourceUserName: 'Gabriel Silva', targetUserName: 'David Kim', sourceUserAvatar: INITIAL_USERS[17].avatar, targetUserAvatar: INITIAL_USERS[1].avatar, connectionType: 'Collaborator', status: 'Active', connectedSince: '2025-03-02', strength: 3 },
  { id: 'e25', sourceUserId: 'u19', targetUserId: 'u10', sourceUserName: 'Nina Kowalski', targetUserName: 'Sophia Chen', sourceUserAvatar: INITIAL_USERS[18].avatar, targetUserAvatar: INITIAL_USERS[9].avatar, connectionType: 'Mentor', status: 'Active', connectedSince: '2025-03-12', strength: 4 },
  { id: 'e26', sourceUserId: 'u19', targetUserId: 'u7', sourceUserName: 'Nina Kowalski', targetUserName: 'Priya Sharma', sourceUserAvatar: INITIAL_USERS[18].avatar, targetUserAvatar: INITIAL_USERS[6].avatar, connectionType: 'Friend', status: 'Active', connectedSince: '2025-03-22', strength: 3 },
  { id: 'e27', sourceUserId: 'u20', targetUserId: 'u14', sourceUserName: 'Tariq O’Connor', targetUserName: 'Marcus Vance', sourceUserAvatar: INITIAL_USERS[19].avatar, targetUserAvatar: INITIAL_USERS[13].avatar, connectionType: 'Colleague', status: 'Active', connectedSince: '2025-04-05', strength: 4 }
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'a1', timestamp: '10 mins ago', user: 'Alex Mercer', avatar: INITIAL_USERS[0].avatar, action: 'established a connection with', target: 'Dr. Elena Rostova', type: 'connection' },
  { id: 'a2', timestamp: '25 mins ago', user: 'Sophia Chen', avatar: INITIAL_USERS[9].avatar, action: 'joined community', target: 'Product Designers', type: 'community' },
  { id: 'a3', timestamp: '1 hour ago', user: 'David Kim', avatar: INITIAL_USERS[1].avatar, action: 'added new connection', target: 'Liam Thorne', type: 'connection' },
  { id: 'a4', timestamp: '3 hours ago', user: 'Dr. Elena Rostova', avatar: INITIAL_USERS[5].avatar, action: 'published network cluster report for', target: 'Data Scientists', type: 'system' },
  { id: 'a5', timestamp: '5 hours ago', user: 'Marcus Vance', avatar: INITIAL_USERS[13].avatar, action: 'joined community', target: 'Growth Engineers', type: 'user' }
];

export const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: 's1',
    user: INITIAL_USERS[6], // Priya Sharma
    mutualConnectionCount: 8,
    mutualConnectionsSample: ['Dr. Elena Rostova', 'Maya Patel', 'Gabriel Silva'],
    sharedCommunity: 'Data Scientists',
    totalConnectionCount: 8,
    reason: 'Recommended because you share 8 mutual connections and belong to Data Scientists.',
    confidenceScore: 96
  },
  {
    id: 's2',
    user: INITIAL_USERS[1], // David Kim
    mutualConnectionCount: 6,
    mutualConnectionsSample: ['Alex Mercer', 'Liam Thorne', 'Sarah Jenkins'],
    sharedCommunity: 'Tech Innovators',
    totalConnectionCount: 7,
    reason: 'Recommended because you share 6 mutual connections with Alex Mercer.',
    confidenceScore: 91
  },
  {
    id: 's3',
    user: INITIAL_USERS[10], // Lucas Dupont
    mutualConnectionCount: 5,
    mutualConnectionsSample: ['Sophia Chen', 'Emma Watson', 'Hannah Abbott'],
    sharedCommunity: 'Product Designers',
    totalConnectionCount: 7,
    reason: 'Recommended because you both belong to the Product Designers community.',
    confidenceScore: 87
  },
  {
    id: 's4',
    user: INITIAL_USERS[14], // Chloe Bennett
    mutualConnectionCount: 4,
    mutualConnectionsSample: ['Marcus Vance', 'Tariq O’Connor'],
    sharedCommunity: 'Growth Engineers',
    totalConnectionCount: 6,
    reason: 'Recommended because you share 4 mutual friends in common with Marcus Vance.',
    confidenceScore: 82
  }
];

export const MOCK_STATS: NetworkStats = {
  totalUsers: INITIAL_USERS.length,
  totalConnections: INITIAL_CONNECTIONS.length,
  totalCommunities: MOCK_COMMUNITIES.length,
  avgConnections: 2.7,
  networkDensity: 0.142,
  mostConnectedUser: {
    name: 'Dr. Elena Rostova',
    connections: 11,
    avatar: INITIAL_USERS[5].avatar
  }
};
