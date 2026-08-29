import React, { useMemo } from 'react';
import { useGraph } from '../context/GraphContext';
import { BarChart3, PieChart, Activity, Users } from 'lucide-react';
import { computeNetworkAnalytics } from '../utils/graphAlgorithms';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { users, connections, communities } = useGraph();

  // Real Calculated Network Analytics
  const analytics = useMemo(() => {
    return computeNetworkAnalytics(users, connections, communities);
  }, [users, connections, communities]);

  const communityChartData = useMemo(() => {
    return communities.map(c => ({
      name: c.name,
      members: c.memberCount,
      density: c.density
    }));
  }, [communities]);

  const connectionTypesCount = useMemo(() => {
    const counts: { [key: string]: number } = {};
    connections.forEach(c => {
      counts[c.connectionType] = (counts[c.connectionType] || 0) + 1;
    });
    return counts;
  }, [connections]);

  const connectionTypeChartData = useMemo(() => {
    return Object.keys(connectionTypesCount).map(type => ({
      name: type,
      count: connectionTypesCount[type]
    }));
  }, [connectionTypesCount]);

  const MONOCHROME_COLORS = ['#ffffff', '#e4e4e7', '#a1a1aa', '#71717a', '#52525b', '#3f3f46'];

  const topCentralityData = useMemo(() => {
    return [...users]
      .sort((a, b) => b.degreeCentrality - a.degreeCentrality)
      .slice(0, 6)
      .map(u => ({
        name: u.name,
        centrality: u.degreeCentrality,
        connections: u.connectionCount
      }));
  }, [users]);

  const degreeHistogramData = useMemo(() => {
    return analytics.degreeDistribution.map(d => ({
      degree: `${d.degree} Edge${d.degree !== 1 ? 's' : ''}`,
      users: d.count
    }));
  }, [analytics]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2.5 tracking-tight">
          <BarChart3 className="w-6 h-6 text-zinc-100" />
          Real Graph Topology Analytics
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Quantitative mathematical metrics, connected component modularity, degree distributions, and structural density reports.
        </p>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/10 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Total Vertices</span>
          <p className="text-xl font-extrabold text-zinc-100 mt-0.5">{analytics.totalUsers}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/10 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Total Edges</span>
          <p className="text-xl font-extrabold text-zinc-100 mt-0.5">{analytics.totalConnections}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/10 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Average Degree</span>
          <p className="text-xl font-extrabold text-zinc-200 mt-0.5">{analytics.avgDegree}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/10 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Graph Density</span>
          <p className="text-xl font-extrabold text-zinc-300 mt-0.5">{analytics.graphDensity}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/10 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Total Clusters</span>
          <p className="text-xl font-extrabold text-zinc-300 mt-0.5">{analytics.totalCommunities}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/10 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Isolated Users</span>
          <p className="text-xl font-extrabold text-zinc-300 mt-0.5">{analytics.isolatedUserCount}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Degree Distribution Histogram */}
        <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-tight">
              <BarChart3 className="w-4 h-4 text-zinc-100" />
              Degree Frequency Distribution Histogram
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">Nodes per Degree</span>
          </div>

          <div className="h-64 w-full">
            {degreeHistogramData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-xs font-mono">
                No user data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={degreeHistogramData}>
                  <XAxis dataKey="degree" stroke="#71717a" fontSize={10} />
                  <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }} />
                  <Bar dataKey="users" fill="#ffffff" radius={[4, 4, 0, 0]} name="User Node Count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Connected Component Member Distribution */}
        <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-tight">
              <Users className="w-4 h-4 text-zinc-100" />
              Cluster Size Distribution
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">{communities.length} Component(s)</span>
          </div>

          <div className="h-64 w-full">
            {communityChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-xs font-mono">
                No clusters available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={communityChartData}>
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                  <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }} />
                  <Bar dataKey="members" fill="#a1a1aa" radius={[4, 4, 0, 0]} name="Members" />
                </BarChart>
              </ResponsiveContainer>
            )}
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
            {topCentralityData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-xs font-mono">
                No centrality data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCentralityData} layout="vertical">
                  <XAxis type="number" stroke="#71717a" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={10} width={90} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }} />
                  <Bar dataKey="centrality" fill="#ffffff" radius={[0, 4, 4, 0]} name="Centrality Metric" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 4: Relationship Type Breakdown */}
        <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-tight">
              <PieChart className="w-4 h-4 text-zinc-100" />
              Relationship Type Categorization
            </h3>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {connectionTypeChartData.length === 0 ? (
              <div className="text-zinc-500 text-xs font-mono">No edge connections available</div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
