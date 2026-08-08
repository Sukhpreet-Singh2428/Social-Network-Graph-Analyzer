import React, { useState, useEffect } from 'react';
import { useGraph } from '../context/GraphContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { PathResult } from '../types';
import { Route, ArrowRight, Zap, Network, ShieldAlert } from 'lucide-react';

export const PathFinderPage: React.FC = () => {
  const { users, findPath, setHighlightedPath, setSelectedNodeId } = useGraph();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialSource = searchParams.get('source') || 'u1';
  const initialTarget = searchParams.get('target') || 'u14';

  const [sourceId, setSourceId] = useState(initialSource);
  const [targetId, setTargetId] = useState(initialTarget);
  const [pathResult, setPathResult] = useState<PathResult | null>(null);

  const handleCalculatePath = () => {
    if (!sourceId || !targetId) return;
    const res = findPath(sourceId, targetId);
    setPathResult(res);
  };

  useEffect(() => {
    handleCalculatePath();
  }, [sourceId, targetId]);

  const handleHighlightOnCanvas = () => {
    if (pathResult && pathResult.found && pathResult.path.length > 0) {
      const nodeIds = pathResult.path.map(u => u.id);
      setHighlightedPath(nodeIds);
      setSelectedNodeId(nodeIds[0]);
      navigate('/network');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2 tracking-tight">
          <Route className="w-6 h-6 text-zinc-100" />
          Shortest Path & Traversal Finder
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Calculate the degrees of separation between any two user vertices in the network graph.
        </p>
      </div>

      {/* User Selection Card */}
      <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source User Picker */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Starting Node (Source User)
            </label>
            <select
              value={sourceId}
              onChange={e => setSourceId(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-lg text-xs font-semibold text-zinc-100 focus:outline-none focus:border-zinc-300 cursor-pointer"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.username}) • {u.communityName}
                </option>
              ))}
            </select>
          </div>

          {/* Destination User Picker */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Target Node (Destination User)
            </label>
            <select
              value={targetId}
              onChange={e => setTargetId(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-lg text-xs font-semibold text-zinc-100 focus:outline-none focus:border-zinc-300 cursor-pointer"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.username}) • {u.communityName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCalculatePath}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider"
        >
          <Zap className="w-4 h-4" />
          Find Shortest Path
        </button>
      </div>

      {/* Path Results Section */}
      {pathResult && (
        <div className="space-y-6">
          {!pathResult.found ? (
            <div className="p-8 text-center rounded-xl bg-zinc-900 border border-white/10 space-y-2">
              <ShieldAlert className="w-8 h-8 text-zinc-400 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">No Path Found</h3>
              <p className="text-xs text-zinc-400">
                {pathResult.sourceUser.name} and {pathResult.targetUser.name} belong to disconnected components.
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-zinc-800 text-zinc-200 rounded border border-zinc-700">
                    Route Resolved
                  </span>
                  <h3 className="text-base font-extrabold text-zinc-100 tracking-tight mt-1">
                    Path Result Summary
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Degrees of Separation</span>
                    <p className="text-xl font-extrabold text-zinc-100">{pathResult.degreesOfSeparation} Hop(s)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Path Length</span>
                    <p className="text-xl font-extrabold text-zinc-300">{pathResult.pathLength} Edge(s)</p>
                  </div>
                </div>
              </div>

              {/* Visual Node Chain Flow */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                  Sequential Traversal Route
                </h4>

                <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg bg-zinc-900 border border-white/5 overflow-x-auto">
                  {pathResult.path.map((user, idx) => (
                    <React.Fragment key={user.id}>
                      <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 shadow-xs">
                        <div className="relative">
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-zinc-100 text-zinc-950 text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-100">{user.name}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">{user.communityName}</p>
                        </div>
                      </div>

                      {idx < pathResult.path.length - 1 && (
                        <div className="flex items-center gap-1 text-zinc-400">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleHighlightOnCanvas}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider"
                >
                  <Network className="w-4 h-4" />
                  Highlight Route on Graph Canvas
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
