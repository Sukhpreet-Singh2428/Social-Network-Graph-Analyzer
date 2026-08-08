import React, { useState } from 'react';
import { useGraph } from '../context/GraphContext';
import { Users2, ArrowRight } from 'lucide-react';
import type { Community } from '../types';
import { Modal } from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';

export const CommunitiesPage: React.FC = () => {
  const { communities, users, setCommunityFilter, setSelectedNodeId } = useGraph();
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const navigate = useNavigate();

  const handleFilterCommunityInNetwork = (communityId: string) => {
    setCommunityFilter(communityId);
    navigate('/network');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2 tracking-tight">
          <Users2 className="w-6 h-6 text-zinc-100" />
          Community Clusters & Subgraphs
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Cluster analysis and modular density metrics across detected social sub-networks.
        </p>
      </div>

      {/* Community Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map(comm => {
          const members = users.filter(u => u.communityId === comm.id);

          return (
            <div
              key={comm.id}
              className="p-6 rounded-xl bg-[#18181b] border border-white/10 hover:border-zinc-500 shadow-sm space-y-5 transition-all duration-200 relative overflow-hidden group"
            >
              {/* Top Accent Color Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 border-b border-white/20"
                style={{ backgroundColor: comm.color }}
              />

              <div className="flex items-start justify-between pt-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20"
                      style={{ backgroundColor: comm.color }}
                    />
                    <h3 className="text-lg font-extrabold text-zinc-100 group-hover:text-white transition-colors">
                      {comm.name}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{comm.description}</p>
                </div>

                <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-zinc-900 border border-zinc-700 text-zinc-200">
                  {comm.density} Density
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-lg bg-zinc-900 border border-white/5 text-center text-xs">
                <div>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Members</span>
                  <p className="text-base font-extrabold text-zinc-100">{members.length}</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Internal Edges</span>
                  <p className="text-base font-extrabold text-zinc-100">{comm.connectionCount}</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Top Leader</span>
                  <p className="text-xs font-bold text-zinc-300 truncate">{comm.mostConnectedMember}</p>
                </div>
              </div>

              {/* Member Avatars Preview */}
              <div>
                <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold block mb-2">
                  Cluster Member Samples
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2 overflow-hidden">
                    {members.slice(0, 6).map(u => (
                      <img
                        key={u.id}
                        src={u.avatar}
                        alt={u.name}
                        title={u.name}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-[#18181b] object-cover border border-white/10"
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedCommunity(comm)}
                    className="text-xs font-bold text-zinc-300 hover:text-white uppercase tracking-wider"
                  >
                    View All {members.length} Members
                  </button>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => handleFilterCommunityInNetwork(comm.id)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg transition-colors uppercase tracking-wider shadow-xs"
                >
                  Isolate Cluster on Canvas Graph
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Roster Modal */}
      {selectedCommunity && (
        <Modal
          isOpen={!!selectedCommunity}
          onClose={() => setSelectedCommunity(null)}
          title={`${selectedCommunity.name} Roster`}
          subtitle={`List of all ${users.filter(u => u.communityId === selectedCommunity.id).length} user vertices.`}
        >
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {users
              .filter(u => u.communityId === selectedCommunity.id)
              .map(u => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                    <div>
                      <p className="font-bold text-zinc-100">{u.name}</p>
                      <p className="text-[10px] text-zinc-400">{u.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedNodeId(u.id);
                      setSelectedCommunity(null);
                      navigate('/network');
                    }}
                    className="px-3 py-1 text-xs font-bold bg-zinc-100 hover:bg-white text-zinc-950 rounded uppercase tracking-wider"
                  >
                    View Node
                  </button>
                </div>
              ))}
          </div>
        </Modal>
      )}
    </div>
  );
};
