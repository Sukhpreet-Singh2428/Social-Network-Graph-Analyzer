import React from 'react';
import { useGraph } from '../context/GraphContext';
import { BarChart3, TrendingUp, PieChart, Activity, Users } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { users, connections, communities } = useGraph();

  const totalUsers = users.length;
  const totalConnections = connections.length;
  const totalCommunities = communities.length;
  const avgDegree = (totalConnections / Math.max(1, totalUsers)).toFixed(2);
  const density = ((2 * totalConnections) / Math.max(1, totalUsers * (totalUsers - 1))).toFixed(3);

  const largestComm = [...communities].sort((a, b) => b.memberCount - a.memberCount)[0];

  const communityChartData = communities.map(c => ({
    name: c.name,
    members: users.filter(u => u.communityId === c.id).length,
    density: c.density
  }));

  const connectionTypesCount: { [key: string]: number } = {};
  connections.forEach(c => {
    connectionTypesCount[c.connectionType] = (connectionTypesCount[c.connectionType] || 0) + 1;
  });

  const connectionTypeChartData = Object.keys(connectionTypesCount).map(type => ({
    name: type,
    count: connectionTypesCount[type]
  }));

  // Monochrome Grayscale Chart Fills
  const MONOCHROME_COLORS = ['#ffffff', '#a1a1aa', '#71717a', '#3f3f46'];

  const temporalGrowthData = [
    { month: 'Oct', users: 10, connections: 14 },
    { month: 'Nov', users: 14, connections: 21 },
    { month: 'Dec', users: 18, connections: 28 },
    { month: 'Jan', users: 22, connections: 36 },
    { month: 'Feb', users: 24, connections: 41 },
    { month: 'Mar', users: totalUsers, connections: totalConnections }
  ];

  const topCentralityData = [...users]
    .sort((a, b) => b.degreeCentrality - a.degreeCentrality)
    .slice(0, 6)
    .map(u => ({
      name: u.name,
      centrality: u.degreeCentrality,
      connections: u.connectionCount
    }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2 tracking-tight">
          <BarChart3 className="w-6 h-6 text-zinc-100" />
          Network Topology Analytics
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Quantitative metrics, modularity algorithms, degree distributions, and structural density reports.
        </p>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/10 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Total Vertices</span>
          <p className="text-xl font-extrabold text-zinc-100 mt-0.5">{totalUsers}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/10 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Total Edges</span>
          <p className="text-xl font-extrabold text-zinc-100 mt-0.5">{totalConnections}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/10 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Average Degree</span>
          <p className="text-xl font-extrabold text-zinc-200 mt-0.5">{avgDegree}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/10 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Graph Density</span>
          <p className="text-xl font-extrabold text-zinc-300 mt-0.5">{density}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/10 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Clusters</span>
          <p className="text-xl font-extrabold text-zinc-300 mt-0.5">{totalCommunities}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/10 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Largest Cluster</span>
          <p className="text-xs font-bold text-zinc-200 mt-1 truncate">{largestComm?.name}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Temporal Growth */}
        <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-tight">
              <TrendingUp className="w-4 h-4 text-zinc-100" />
              Network Growth Over Time
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">6 Months</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={temporalGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }} />
                <Area type="monotone" dataKey="users" stroke="#ffffff" fillOpacity={1} fill="url(#colorUsers)" name="Users" />
                <Area type="monotone" dataKey="connections" stroke="#a1a1aa" fillOpacity={1} fill="url(#colorConn)" name="Connections" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Community Size Distribution */}
        <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-tight">
              <Users className="w-4 h-4 text-zinc-100" />
              Community Member Distribution
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">4 Clusters</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={communityChartData}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }} />
                <Bar dataKey="members" fill="#a1a1aa" radius={[4, 4, 0, 0]} name="Members" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Degree Centrality Ranking */}
        <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-tight">
              <Activity className="w-4 h-4 text-zinc-100" />
              Degree Centrality Ranking (Top Nodes)
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCentralityData} layout="vertical">
                <XAxis type="number" stroke="#71717a" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={10} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }} />
                <Bar dataKey="centrality" fill="#ffffff" radius={[0, 4, 4, 0]} name="Centrality Metric" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Connection Relationship Type Breakdown */}
        <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-tight">
              <PieChart className="w-4 h-4 text-zinc-100" />
              Relationship Type Breakdown
            </h3>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={connectionTypeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {connectionTypeChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={MONOCHROME_COLORS[index % MONOCHROME_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
