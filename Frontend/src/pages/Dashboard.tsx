import React, { useState, useMemo } from 'react';
import { useGraph } from '../context/GraphContext';
import { StatCard } from '../components/common/StatCard';
import { Users, GitCommit, Users2, Activity, Zap, Award, ArrowRight, UserPlus, Link2, Route, ShieldAlert, Layers } from 'lucide-react';
import { AddUserModal } from '../components/modals/AddUserModal';
import { AddConnectionModal } from '../components/modals/AddConnectionModal';
import { computeNetworkAnalytics } from '../utils/graphAlgorithms';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { users, connections, communities, setSelectedNodeId } = useGraph();
  const navigate = useNavigate();

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddConnOpen, setIsAddConnOpen] = useState(false);

  // Real Graph Analytics
  const analytics = useMemo(() => {
    return computeNetworkAnalytics(users, connections, communities);
  }, [users, connections, communities]);

  const topUsers = useMemo(() => {
    return [...users].sort((a, b) => b.connectionCount - a.connectionCount).slice(0, 5);
  }, [users]);

  const mostConnectedUser = analytics.mostConnectedUser || topUsers[0] || null;

  const handleInspectUser = (userId: string) => {
    setSelectedNodeId(userId);
    navigate('/network');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#121215] border border-zinc-800 shadow-xs relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-zinc-900 text-zinc-300 rounded border border-zinc-800">
              Topology Engine Active
            </span>
            <span className="text-[10px] text-zinc-500 font-mono uppercase">Phase 2 Release</span>
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-100 tracking-tight">
            Network Analytics Dashboard
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            Real-time social graph metrics, connected component cluster density, degree centrality rankings, and topology diagnostics.
          </p>
        </div>

        {/* Quick Action Button Group */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg transition-colors uppercase tracking-wider shadow-xs"
            aria-label="Add User Node"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
          <button
            onClick={() => setIsAddConnOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors uppercase tracking-wider"
            aria-label="Add Edge Connection"
          >
            <Link2 className="w-4 h-4" />
            Add Connection
          </button>
          <button
            onClick={() => navigate('/path-finder')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors uppercase tracking-wider"
            aria-label="Navigate to Path Finder Suite"
          >
            <Route className="w-4 h-4" />
            Path Finder
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          subtitle="graph vertices"
          icon={Users}
        />
        <StatCard
          title="Total Connections"
          value={analytics.totalConnections}
          subtitle="graph edges"
          icon={GitCommit}
        />
        <StatCard
          title="Clusters"
          value={analytics.totalCommunities}
          badge={`${communities.length} Active`}
          icon={Users2}
        />
        <StatCard
          title="Avg Degree"
          value={analytics.avgDegree}
          subtitle="connections / user"
          icon={Zap}
        />
        <StatCard
          title="Graph Density"
          value={analytics.graphDensity}
          subtitle="saturation ratio"
          icon={Activity}
        />
        <StatCard
          title="Top Influencer"
          value={mostConnectedUser ? mostConnectedUser.name.split(' ')[0] : 'N/A'}
          subtitle={mostConnectedUser ? `${mostConnectedUser.connectionCount} edges` : '0 edges'}
          icon={Award}
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Graph Overview & Top Influencers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-[#121215] border border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-100">Interactive Topology Overview</h3>
                <p className="text-xs text-zinc-400">Visual layout of active vertices and community edges</p>
              </div>
              <button
                onClick={() => navigate('/network')}
                className="flex items-center gap-1 text-xs font-bold text-zinc-100 hover:text-white transition-colors uppercase tracking-wider"
                aria-label="Open Full Screen Network Graph Canvas"
              >
                Full Screen Canvas
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Graph Preview Box */}
            <div
              onClick={() => navigate('/network')}
              className="relative h-64 rounded-xl border border-zinc-800 bg-[#09090b] overflow-hidden group cursor-pointer flex items-center justify-center"
            >
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center">
                <div className="w-11 h-11 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-tight">Explore Interactive Network Graph</h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                    Drag nodes, zoom canvas, filter by community cluster, and inspect detailed node profiles.
                  </p>
                </div>
                <span className="px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-xs">
                  Launch Canvas Graph
                </span>
              </div>
            </div>

            {/* Top Central Nodes Table */}
            <div className="pt-2">
              <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-3">
                Top Connected Influencers (Degree Centrality)
              </h4>
              {topUsers.length === 0 ? (
                <p className="text-xs text-zinc-500 font-mono">No users available.</p>
              ) : (
                <div className="space-y-2">
                  {topUsers.map((user, idx) => (
                    <div
                      key={user.id}
                      onClick={() => handleInspectUser(user.id)}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center font-mono font-bold text-xs text-zinc-500">#{idx + 1}</span>
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-zinc-700" />
                        <div>
                          <p className="text-xs font-bold text-zinc-100">{user.name}</p>
                          <p className="text-[10px] text-zinc-400">ID: #{user.id} • {user.role} • {user.communityName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-zinc-100">{user.connectionCount} edges</span>
                        <p className="text-[10px] font-mono text-zinc-500">Degree: {user.degreeCentrality}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Topology Diagnostics & Community Summary */}
        <div className="space-y-6">
          {/* Topology Health Diagnostics Widget (Replaced fake MOCK_ACTIVITY) */}
          <div className="p-6 rounded-xl bg-[#121215] border border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-tight text-zinc-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-zinc-100" />
                Network Topology Diagnostics
              </h3>
              <span className="text-[9px] font-mono uppercase font-bold text-zinc-500">Real-Time</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-zinc-400" />
                  <span className="font-medium text-zinc-200">Isolated Vertices ($N=1$)</span>
                </div>
                <span className="font-mono font-bold text-zinc-100">{analytics.isolatedUserCount} user(s)</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-400" />
                  <span className="font-medium text-zinc-200">Largest Component Size</span>
                </div>
                <span className="font-mono font-bold text-zinc-100">{analytics.largestCommunitySize} node(s)</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-zinc-400" />
                  <span className="font-medium text-zinc-200">Max Degree Peak</span>
                </div>
                <span className="font-mono font-bold text-zinc-100">{analytics.maxDegree} edge(s)</span>
              </div>
            </div>
          </div>

          {/* Communities Summary Widget */}
          <div className="p-6 rounded-xl bg-[#121215] border border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                Community Clusters ({communities.length})
              </h4>
              <button
                onClick={() => navigate('/communities')}
                className="text-xs font-bold text-zinc-300 hover:text-white uppercase tracking-wider"
              >
                View All
              </button>
            </div>
            {communities.length === 0 ? (
              <p className="text-xs text-zinc-500 font-mono">No clusters detected.</p>
            ) : (
              <div className="space-y-2">
                {communities.slice(0, 4).map(comm => (
                  <div key={comm.id} className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: comm.color }} />
                      <div>
                        <p className="text-xs font-bold text-zinc-200">{comm.name}</p>
                        <p className="text-[10px] text-zinc-400">{comm.memberCount} members</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      {comm.density} density
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} />
      <AddConnectionModal isOpen={isAddConnOpen} onClose={() => setIsAddConnOpen(false)} />
    </div>
  );
};
