import React from 'react';
import { useGraph } from '../context/GraphContext';
import { Sparkles, UserPlus, Network, HelpCircle } from 'lucide-react';
import { MOCK_SUGGESTIONS } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const SuggestionsPage: React.FC = () => {
  const { addConnection, setSelectedNodeId } = useGraph();
  const navigate = useNavigate();

  const handleConnect = (targetUserId: string) => {
    addConnection('u1', targetUserId, 'Friend');
  };

  const handleViewNetwork = (userId: string) => {
    setSelectedNodeId(userId);
    navigate('/network');
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2 tracking-tight">
          <Sparkles className="w-6 h-6 text-zinc-100" />
          Graph Connection Recommendations
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Recommendations generated algorithmically from static graph topology (mutual friend counters & shared community clusters).
        </p>
      </div>

      {/* Notice Banner */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 flex items-start gap-3 text-xs text-zinc-300">
        <HelpCircle className="w-4 h-4 text-zinc-100 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-zinc-100 uppercase tracking-tight">Graph-Based Discovery Logic:</span>
          <p className="mt-0.5 text-zinc-400">
            These suggestions are calculated purely from mock network edges and shared community assignments for Alex Mercer (@alex_m).
          </p>
        </div>
      </div>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_SUGGESTIONS.map(sugg => (
          <div
            key={sugg.id}
            className="p-6 rounded-xl bg-[#18181b] border border-white/10 hover:border-zinc-500 shadow-sm space-y-5 transition-all duration-200 group"
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={sugg.user.avatar}
                  alt={sugg.user.name}
                  className="w-14 h-14 rounded-full object-cover border border-white/20 group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="text-base font-extrabold text-zinc-100 group-hover:text-white transition-colors">
                    {sugg.user.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">{sugg.user.username}</p>
                  <p className="text-xs text-zinc-400">{sugg.user.role}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-zinc-900 text-zinc-100 rounded border border-zinc-700">
                {sugg.confidenceScore}% Match
              </span>
            </div>

            {/* Key Metrics Badges */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-zinc-900 border border-white/5 text-xs">
              <div>
                <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Mutual Connections</span>
                <p className="text-sm font-extrabold text-zinc-100">{sugg.mutualConnectionCount} mutual friends</p>
              </div>
              <div>
                <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Shared Community</span>
                <p className="text-sm font-bold text-zinc-300 truncate">{sugg.sharedCommunity}</p>
              </div>
            </div>

            {/* Why This Person Explanation */}
            <div className="p-3.5 rounded-lg bg-zinc-900 border border-white/5 text-xs text-zinc-300">
              <span className="font-bold text-zinc-100 uppercase tracking-widest text-[9px] font-mono block mb-1">Why this recommendation?</span>
              <p className="text-zinc-300 leading-relaxed text-xs">{sugg.reason}</p>
              
              {/* Mutual Friends Sample Pills */}
              {sugg.mutualConnectionsSample.length > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono text-zinc-400">Mutuals:</span>
                  {sugg.mutualConnectionsSample.map((name, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-800 text-zinc-300 border border-zinc-700"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleConnect(sugg.user.id)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider"
              >
                <UserPlus className="w-4 h-4" />
                Connect Node
              </button>
              <button
                onClick={() => handleViewNetwork(sugg.user.id)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-white/10 transition-colors uppercase tracking-wider"
              >
                <Network className="w-4 h-4" />
                View Network
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
