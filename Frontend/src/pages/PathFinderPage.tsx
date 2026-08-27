import React, { useState, useEffect } from 'react';
import { useGraph } from '../context/GraphContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { bfsShortestPath, bfsTraversal, dfsTraversal } from '../utils/graphAlgorithms';
import type { PathResult, BfsTraversalResult, DfsTraversalResult } from '../types';
import { Route, ArrowRight, Zap, Network, ShieldAlert, Layers, GitBranch, Play } from 'lucide-react';

type Mode = 'shortest_path' | 'bfs' | 'dfs';

export const PathFinderPage: React.FC = () => {
  const { users, connections, setHighlightedPath, setSelectedNodeId } = useGraph();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('shortest_path');

  // Fix Stale Mock Default IDs by dynamically selecting loaded users
  const [sourceId, setSourceId] = useState<string>('');
  const [targetId, setTargetId] = useState<string>('');
  const [startId, setStartId] = useState<string>('');

  useEffect(() => {
    if (users.length > 0) {
      const urlSource = searchParams.get('source');
      const urlTarget = searchParams.get('target');

      const validSource = urlSource && users.some(u => u.id === urlSource) ? urlSource : users[0].id;
      const validTarget = urlTarget && users.some(u => u.id === urlTarget) ? urlTarget : (users.length > 1 ? users[1].id : users[0].id);

      if (!sourceId) setSourceId(validSource);
      if (!targetId) setTargetId(validTarget);
      if (!startId) setStartId(validSource);
    }
  }, [users, searchParams]);

  // Results State
  const [shortestPathResult, setShortestPathResult] = useState<PathResult | null>(null);
  const [bfsResult, setBfsResult] = useState<BfsTraversalResult | null>(null);
  const [dfsResult, setDfsResult] = useState<DfsTraversalResult | null>(null);

  const handleCalculate = () => {
    if (mode === 'shortest_path') {
      if (!sourceId || !targetId) return;
      const res = bfsShortestPath(users, connections, sourceId, targetId);
      setShortestPathResult(res);
    } else if (mode === 'bfs') {
      if (!startId) return;
      const res = bfsTraversal(users, connections, startId);
      setBfsResult(res);
    } else if (mode === 'dfs') {
      if (!startId) return;
      const res = dfsTraversal(users, connections, startId);
      setDfsResult(res);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [sourceId, targetId, startId, mode, users, connections]);

  const handleHighlightPathOnCanvas = (userPath: { id: string }[]) => {
    if (userPath.length > 0) {
      const nodeIds = userPath.map(u => u.id);
      setHighlightedPath(nodeIds);
      setSelectedNodeId(nodeIds[0]);
      navigate('/network');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2.5 tracking-tight">
          <Route className="w-6 h-6 text-zinc-100" />
          Graph Algorithm & Traversal Suite
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Execute BFS Shortest Path, Level-order BFS Traversal, or Iterative DFS Traversal on your live network graph.
        </p>
      </div>

      {/* Mode Selector Segmented Tabs */}
      <div className="flex items-center p-1 rounded-xl bg-[#18181b] border border-white/10 max-w-md">
        <button
          onClick={() => setMode('shortest_path')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
            mode === 'shortest_path'
              ? 'bg-zinc-100 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Shortest Path
        </button>
        <button
          onClick={() => setMode('bfs')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
            mode === 'bfs'
              ? 'bg-zinc-100 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          BFS Traversal
        </button>
        <button
          onClick={() => setMode('dfs')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
            mode === 'dfs'
              ? 'bg-zinc-100 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          DFS Traversal
        </button>
      </div>

      {/* Algorithm Config Card */}
      <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-5">
        {users.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 text-xs font-medium">
            No user nodes exist in the backend graph store yet. Add users first to calculate paths.
          </div>
        ) : mode === 'shortest_path' ? (
          <div className="space-y-4">
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
                      {u.name} (ID: #{u.id}) • {u.communityName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target User Picker */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  Destination Node (Target User)
                </label>
                <select
                  value={targetId}
                  onChange={e => setTargetId(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-lg text-xs font-semibold text-zinc-100 focus:outline-none focus:border-zinc-300 cursor-pointer"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} (ID: #{u.id}) • {u.communityName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider"
            >
              <Zap className="w-4 h-4" />
              Calculate BFS Shortest Path
            </button>
          </div>
        ) : (
          /* BFS / DFS Single Start Picker */
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Root Start Vertex ({mode.toUpperCase()})
              </label>
              <select
                value={startId}
                onChange={e => setStartId(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-lg text-xs font-semibold text-zinc-100 focus:outline-none focus:border-zinc-300 cursor-pointer"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} (ID: #{u.id}) • {u.communityName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider"
            >
              <Play className="w-4 h-4" />
              Execute {mode.toUpperCase()} Traversal
            </button>
          </div>
        )}
      </div>

      {/* Mode 1: Shortest Path Results */}
      {mode === 'shortest_path' && shortestPathResult && (
        <div className="space-y-6">
          {!shortestPathResult.found ? (
            <div className="p-8 text-center rounded-xl bg-[#18181b] border border-white/10 space-y-2">
              <ShieldAlert className="w-8 h-8 text-zinc-400 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">No Path Found</h3>
              <p className="text-xs text-zinc-400">
                {shortestPathResult.sourceUser?.name} and {shortestPathResult.targetUser?.name} belong to disconnected graph components.
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
                    <p className="text-xl font-extrabold text-zinc-100">{shortestPathResult.degreesOfSeparation} Hop(s)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Path Length</span>
                    <p className="text-xl font-extrabold text-zinc-300">{shortestPathResult.pathLength} Edge(s)</p>
                  </div>
                </div>
              </div>

              {/* Node Sequence Chain */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                  Sequential Traversal Route
                </h4>

                <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg bg-zinc-900 border border-white/5 overflow-x-auto">
                  {shortestPathResult.path.map((user, idx) => (
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
                          <p className="text-[10px] text-zinc-400 font-mono">ID: #{user.id}</p>
                        </div>
                      </div>

                      {idx < shortestPathResult.path.length - 1 && (
                        <div className="flex items-center gap-1 text-zinc-400">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleHighlightPathOnCanvas(shortestPathResult.path)}
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

      {/* Mode 2: BFS Traversal Results */}
      {mode === 'bfs' && bfsResult && (
        <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-zinc-800 text-zinc-200 rounded border border-zinc-700">
                BFS Level Order Complete
              </span>
              <h3 className="text-base font-extrabold text-zinc-100 tracking-tight mt-1">
                Breadth-First Search Output
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Total Reached</span>
                <p className="text-xl font-extrabold text-zinc-100">{bfsResult.totalVisited} Node(s)</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Max Depth</span>
                <p className="text-xl font-extrabold text-zinc-300">{bfsResult.levels.length - 1} Level(s)</p>
              </div>
            </div>
          </div>

          {/* Level Breakdown List */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              Level-by-Level Graph Expansion
            </h4>

            <div className="space-y-3">
              {bfsResult.levels.map(level => (
                <div key={level.depth} className="p-4 rounded-lg bg-zinc-900 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-zinc-300">
                      Level {level.depth} {level.depth === 0 ? '(Root Node)' : `(Depth ${level.depth})`}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{level.nodes.length} node(s)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {level.nodes.map(u => (
                      <span key={u.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200">
                        <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                        {u.name} <span className="text-[10px] text-zinc-400 font-mono">(#{u.id})</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleHighlightPathOnCanvas(bfsResult.visitedOrder)}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider"
            >
              <Network className="w-4 h-4" />
              Highlight BFS Order on Graph Canvas
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: DFS Traversal Results */}
      {mode === 'dfs' && dfsResult && (
        <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-zinc-800 text-zinc-200 rounded border border-zinc-700">
                DFS Iterative Stack Complete
              </span>
              <h3 className="text-base font-extrabold text-zinc-100 tracking-tight mt-1">
                Depth-First Search Output
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Total Reached</span>
              <p className="text-xl font-extrabold text-zinc-100">{dfsResult.totalVisited} Node(s)</p>
            </div>
          </div>

          {/* Sequential Order List */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              Visited Order Sequence (Explicit Stack)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {dfsResult.visitedOrder.map((u, idx) => (
                <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-white/5 text-xs">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-200 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 border border-zinc-700">
                    {idx + 1}
                  </span>
                  <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-100 truncate">{u.name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">ID: #{u.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleHighlightPathOnCanvas(dfsResult.visitedOrder)}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider"
            >
              <Network className="w-4 h-4" />
              Highlight DFS Order on Graph Canvas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
