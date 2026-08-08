import React, { useState } from 'react';
import { useGraph } from '../context/GraphContext';
import { NetworkCanvas } from '../components/graph/NetworkCanvas';
import { NodeDetailsPanel } from '../components/graph/NodeDetailsPanel';
import { AddConnectionModal } from '../components/modals/AddConnectionModal';
import { AddUserModal } from '../components/modals/AddUserModal';
import { Filter, Eye, EyeOff, UserPlus, Link2, X } from 'lucide-react';

export const NetworkGraphPage: React.FC = () => {
  const {
    selectedNodeId,
    setSelectedNodeId,
    communityFilter,
    setCommunityFilter,
    communities,
    nodeLabelsVisible,
    setNodeLabelsVisible,
    highlightedPath,
    setHighlightedPath
  } = useGraph();

  const [isAddConnOpen, setIsAddConnOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  return (
    <div className="relative flex w-full h-[calc(100vh-4rem)] overflow-hidden bg-[#09090b]">
      {/* Top Overlay Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#18181b]/95 backdrop-blur-md border border-white/10 shadow-2xl pointer-events-auto">
        <div className="flex items-center gap-3">
          {/* Community Filter Dropdown */}
          <div className="relative flex items-center">
            <Filter className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
            <select
              value={communityFilter}
              onChange={e => setCommunityFilter(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs font-semibold bg-zinc-900 border border-white/10 rounded-lg text-zinc-200 focus:outline-none focus:border-zinc-400 cursor-pointer"
            >
              <option value="all">Filter: All Communities</option>
              {communities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Node Labels Toggle */}
          <button
            onClick={() => setNodeLabelsVisible(!nodeLabelsVisible)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              nodeLabelsVisible
                ? 'bg-zinc-100 text-zinc-950 border-white'
                : 'bg-zinc-900 text-zinc-400 border-white/10'
            }`}
          >
            {nodeLabelsVisible ? <Eye className="w-3.5 h-3.5 text-zinc-950" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Labels {nodeLabelsVisible ? 'On' : 'Off'}</span>
          </button>

          {/* Path Highlight Clear Badge */}
          {highlightedPath.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 text-xs font-mono">
              <span className="font-bold uppercase text-[10px]">Path Active ({highlightedPath.length} nodes)</span>
              <button
                onClick={() => setHighlightedPath([])}
                className="p-0.5 hover:text-white"
                title="Clear Path"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded-lg border border-white/10 transition-colors uppercase tracking-wider"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add User
          </button>
          <button
            onClick={() => setIsAddConnOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg shadow-sm transition-colors uppercase tracking-wider"
          >
            <Link2 className="w-3.5 h-3.5" />
            Add Edge
          </button>
        </div>
      </div>

      {/* Main Interactive HTML5 Canvas */}
      <NetworkCanvas />

      {/* Side Inspector Panel */}
      {selectedNodeId && (
        <NodeDetailsPanel
          onClose={() => setSelectedNodeId(null)}
          onOpenAddConnectionModal={() => setIsAddConnOpen(true)}
        />
      )}

      {/* Modals */}
      <AddConnectionModal isOpen={isAddConnOpen} onClose={() => setIsAddConnOpen(false)} />
      <AddUserModal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} />
    </div>
  );
};
