import React, { useState } from 'react';
import { useGraph } from '../context/GraphContext';
import { Search, Filter, UserPlus, LayoutGrid, List, Route, Network, ArrowUpDown, RefreshCw, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { AddUserModal } from '../components/modals/AddUserModal';
import { ConfirmDeleteModal } from '../components/modals/ConfirmDeleteModal';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

export const UsersPage: React.FC = () => {
  const { users, communities, setSelectedNodeId, usersLoading, usersError, refetchData } = useGraph();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'connections' | 'centrality' | 'name'>('connections');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = users.filter(u => {
    const searchLower = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(searchLower) ||
      u.id.toLowerCase().includes(searchLower) ||
      u.username.toLowerCase().includes(searchLower) ||
      u.role.toLowerCase().includes(searchLower)
    );
  }).sort((a, b) => {
    if (sortBy === 'connections') return b.connectionCount - a.connectionCount;
    if (sortBy === 'centrality') return b.degreeCentrality - a.degreeCentrality;
    return a.name.localeCompare(b.name);
  });

  const handleInspect = (userId: string) => {
    setSelectedNodeId(userId);
    navigate('/network');
  };

  const handleFindPath = (userId: string) => {
    navigate(`/path-finder?source=${userId}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-100 tracking-tight">User Network Directory</h1>
          <p className="text-xs text-zinc-400">
            Overview of all {users.length} active user node entities from Spring Boot backend.
          </p>
        </div>

        <button
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Add User Node
        </button>
      </div>

      {/* Filters & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#18181b] border border-white/10 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search user name or numeric ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 font-medium"
            />
          </div>

          {/* Gracefully Degraded Community Filter */}
          <div className="relative opacity-60 cursor-not-allowed" title="Community filtering disabled - backend User model does not store community clusters">
            <select
              disabled
              value="all"
              className="pl-8 pr-4 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-zinc-400 cursor-not-allowed font-medium"
            >
              <option value="all">All Communities (Disabled)</option>
              {communities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="pl-8 pr-4 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-zinc-300 focus:outline-none focus:border-zinc-400 cursor-pointer font-medium"
            >
              <option value="connections">Sort: Connections (High to Low)</option>
              <option value="centrality">Sort: Centrality Metric</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>
            <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded text-xs transition-colors ${
              viewMode === 'grid' ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded text-xs transition-colors ${
              viewMode === 'table' ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {usersLoading ? (
        <div className="p-16 text-center rounded-xl bg-[#18181b] border border-white/10 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-zinc-200 animate-spin" />
          <p className="text-zinc-300 font-bold text-sm">Loading users from backend...</p>
        </div>
      ) : usersError ? (
        <div className="p-12 text-center rounded-xl bg-[#18181b] border border-red-500/30 space-y-4 max-w-2xl mx-auto">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-zinc-100">Backend Unreachable</h3>
            <p className="text-xs text-zinc-400 mt-1">{usersError}</p>
          </div>
          <button
            onClick={() => refetchData()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg transition-colors uppercase tracking-wider"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="p-16 text-center rounded-xl bg-[#18181b] border border-white/10 space-y-4 max-w-lg mx-auto">
          <UserPlus className="w-10 h-10 text-zinc-400 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-zinc-100">No users yet</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Create your first user to start building the network graph.
            </p>
          </div>
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider"
          >
            <UserPlus className="w-4 h-4" />
            Add User Node
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#18181b] border border-white/10 space-y-2">
          <p className="text-zinc-200 font-bold text-sm">No user nodes match your search query.</p>
          <p className="text-zinc-500 text-xs">Try clearing your search input.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className="p-5 rounded-xl bg-[#18181b] border border-white/10 hover:border-zinc-500 shadow-sm space-y-4 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-11 h-11 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">
                      {user.name}
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono">ID: {user.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setUserToDelete(user)}
                  className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                  title="Delete User Node"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-zinc-300 font-medium truncate">{user.role}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-zinc-400">
                  <span className="px-2.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-700 text-[10px] font-mono">
                    Node #{user.id}
                  </span>
                  <span className="font-bold text-zinc-100">{user.connectionCount} edges</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleInspect(user.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg transition-colors uppercase tracking-wider"
                >
                  <Network className="w-3.5 h-3.5" />
                  View Node
                </button>
                <button
                  onClick={() => handleFindPath(user.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-white/10 transition-colors uppercase tracking-wider"
                >
                  <Route className="w-3.5 h-3.5" />
                  Find Path
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-[#18181b] border border-white/10 shadow-sm">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 uppercase font-mono font-bold text-[10px] tracking-wider text-zinc-400 border-b border-white/10">
              <tr>
                <th className="p-4">User ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Connections</th>
                <th className="p-4">Centrality</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-zinc-100">#{user.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                      <div>
                        <p className="font-bold text-zinc-100">{user.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-300">{user.role}</td>
                  <td className="p-4 font-bold text-zinc-100">{user.connectionCount}</td>
                  <td className="p-4 font-mono text-zinc-100">{user.degreeCentrality}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleInspect(user.id)}
                      className="px-3 py-1 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-[11px] uppercase tracking-wider"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => setUserToDelete(user)}
                      className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors inline-block align-middle"
                      title="Delete User Node"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <AddUserModal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} />
      <ConfirmDeleteModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        user={userToDelete}
      />
    </div>
  );
};
