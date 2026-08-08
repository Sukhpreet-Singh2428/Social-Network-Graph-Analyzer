import React, { useState } from 'react';
import { useGraph } from '../context/GraphContext';
import { Search, Filter, Link2, Trash2, ArrowRight, GitCommit } from 'lucide-react';
import { AddConnectionModal } from '../components/modals/AddConnectionModal';
import { ConfirmDeleteModal } from '../components/modals/ConfirmDeleteModal';
import type { Connection } from '../types';

export const ConnectionsPage: React.FC = () => {
  const { connections } = useGraph();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddConnOpen, setIsAddConnOpen] = useState(false);
  const [selectedDeleteConn, setSelectedDeleteConn] = useState<Connection | null>(null);

  const filteredConnections = connections.filter(c => {
    const matchesSearch =
      c.sourceUserName.toLowerCase().includes(search.toLowerCase()) ||
      c.targetUserName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || c.connectionType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-100 tracking-tight">Graph Connections & Edges</h1>
          <p className="text-xs text-zinc-400">
            Directory of all {connections.length} active relationships connecting user nodes.
          </p>
        </div>

        <button
          onClick={() => setIsAddConnOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider self-start sm:self-auto"
        >
          <Link2 className="w-4 h-4" />
          Add Edge Connection
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#18181b] border border-white/10 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by connected user names..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 font-medium"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="pl-8 pr-4 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-zinc-300 focus:outline-none focus:border-zinc-400 cursor-pointer font-medium"
            >
              <option value="all">All Relationship Types</option>
              <option value="Colleague">Colleague</option>
              <option value="Friend">Friend</option>
              <option value="Collaborator">Collaborator</option>
              <option value="Mentor">Mentor</option>
            </select>
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl bg-[#18181b] border border-white/10 shadow-sm">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 uppercase font-mono font-bold text-[10px] tracking-wider text-zinc-400 border-b border-white/10">
            <tr>
              <th className="p-4">Source User</th>
              <th className="p-4 text-center">Edge</th>
              <th className="p-4">Target User</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Connected Since</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredConnections.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-400 font-medium">
                  No edge connections match your criteria.
                </td>
              </tr>
            ) : (
              filteredConnections.map(c => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={c.sourceUserAvatar} alt={c.sourceUserName} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                      <span className="font-bold text-zinc-100">{c.sourceUserName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-zinc-100 font-mono">
                      <GitCommit className="w-4 h-4" />
                      <ArrowRight className="w-3 h-3 text-zinc-500" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={c.targetUserAvatar} alt={c.targetUserName} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                      <span className="font-bold text-zinc-100">{c.targetUserName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700 text-[10px] font-mono">
                      {c.connectionType}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-200 border border-zinc-700">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-zinc-400">{c.connectedSince}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedDeleteConn(c)}
                      className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Delete Edge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddConnectionModal isOpen={isAddConnOpen} onClose={() => setIsAddConnOpen(false)} />
      <ConfirmDeleteModal
        isOpen={!!selectedDeleteConn}
        onClose={() => setSelectedDeleteConn(null)}
        connection={selectedDeleteConn}
      />
    </div>
  );
};
