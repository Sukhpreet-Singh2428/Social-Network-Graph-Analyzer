import React, { useState } from 'react';
import { useGraph } from '../context/GraphContext';
import { NetworkCanvas } from '../components/graph/NetworkCanvas';
import { NodeDetailsPanel } from '../components/graph/NodeDetailsPanel';
import { AddConnectionModal } from '../components/modals/AddConnectionModal';
import { AddUserModal } from '../components/modals/AddUserModal';
import { Filter, Eye, EyeOff, UserPlus, Link2, X, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

export const NetworkGraphPage: React.FC = () => {
  const {
    users,
    selectedNodeId,
    setSelectedNodeId,
    communityFilter,
    setCommunityFilter,
    communities,
    nodeLabelsVisible,
    setNodeLabelsVisible,
    highlightedPath,
    setHighlightedPath,
    usersLoading,
    connectionsLoading,
    usersError,
    connectionsError,
    refetchData
  } = useGraph();

  const [isAddConnOpen, setIsAddConnOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const isLoading = usersLoading || connectionsLoading;
  const errorMsg = usersError || connectionsError;
  const hasNoUsers = !isLoading && !errorMsg && users.length === 0;

  return (
    <div className="relative flex w-full h-[calc(100vh-4rem)] overflow-hidden bg-[#09090b]">
      {/* Top Overlay Control Bar (rendered when data is loaded or users exist) */}
      {!isLoading && !errorMsg && !hasNoUsers && (
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
      )}

      {/* Canvas / Loading / Error / Empty View States */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-[#09090b]">
          <Loader2 className="w-8 h-8 text-zinc-200 animate-spin" />
          <p className="text-zinc-300 font-bold text-sm">Loading network graph...</p>
        </div>
      ) : errorMsg ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#09090b]">
          <div className="p-10 rounded-xl bg-[#18181b] border border-red-500/30 text-center space-y-4 max-w-lg shadow-2xl">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-zinc-100">Unable to load network graph</h3>
              <p className="text-xs text-zinc-400 mt-1.5">
                Make sure the Spring Boot backend is running and try again.
              </p>
              <p className="text-[11px] text-zinc-500 font-mono mt-1">{errorMsg}</p>
            </div>
            <button
              onClick={() => refetchData()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg transition-colors uppercase tracking-wider shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        </div>
      ) : hasNoUsers ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#09090b]">
          <div className="p-10 rounded-xl bg-[#18181b] border border-white/10 text-center space-y-4 max-w-lg shadow-2xl">
            <UserPlus className="w-10 h-10 text-zinc-400 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-zinc-100">No network data yet</h3>
              <p className="text-xs text-zinc-400 mt-1.5">
                Add users and create connections to start building your social network.
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
        </div>
      ) : (
        /* Main Interactive HTML5 Canvas (Renders isolated nodes even if connections.length === 0) */
        <NetworkCanvas />
      )}

      {/* Side Inspector Panel */}
      {!isLoading && !errorMsg && !hasNoUsers && selectedNodeId && (
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
