import React from 'react';
import { useGraph } from '../../context/GraphContext';
import { X, UserPlus, Route, Network as NetworkIcon, MapPin, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NodeDetailsPanelProps {
  onClose: () => void;
  onOpenAddConnectionModal: () => void;
}

export const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
  onClose,
  onOpenAddConnectionModal
}) => {
  const { selectedNodeId, getUserById, getMutualConnections, connections, users } = useGraph();
  const navigate = useNavigate();

  if (!selectedNodeId) return null;
  const user = getUserById(selectedNodeId);
  if (!user) return null;

  const nodeConnections = connections.filter(
    c => c.sourceUserId === user.id || c.targetUserId === user.id
  );

  const rootUserId = users[0]?.id;
  const mutualsWithRoot = (user.id !== rootUserId && rootUserId) ? getMutualConnections(user.id, rootUserId) : [];

  const handleStartPathFinder = () => {
    navigate(`/path-finder?source=${user.id}`);
  };

  return (
    <aside className="w-80 border-l border-white/10 bg-[#18181b]/95 backdrop-blur-xl h-full flex flex-col z-20 text-zinc-200 shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Panel Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-950">
        <div className="flex items-center gap-2">
          <NetworkIcon className="w-4 h-4 text-zinc-100" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
            Node Inspector
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Avatar & User Info */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-white/30 shadow-xl"
            />
            <span
              className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-[#18181b] ${
                user.status === 'online' ? 'bg-zinc-100' : 'bg-zinc-600'
              }`}
            />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-zinc-100">{user.name}</h3>
            <p className="text-xs text-zinc-400 font-mono">ID: #{user.id}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{user.role}</p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700">
              {user.communityName}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleStartPathFinder}
            className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg transition-colors uppercase tracking-wider shadow-xs"
          >
            <Route className="w-3.5 h-3.5" />
            Find Path
          </button>
          <button
            onClick={onOpenAddConnectionModal}
            className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors uppercase tracking-wider"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Edge
          </button>
        </div>

        {/* Centrality Metrics */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-zinc-900 border border-white/5 text-center">
          <div>
            <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Connections</span>
            <p className="text-lg font-extrabold text-zinc-100">{user.connectionCount}</p>
          </div>
          <div>
            <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Degree Centrality</span>
            <p className="text-lg font-extrabold text-zinc-100">{user.degreeCentrality}</p>
          </div>
        </div>

        {/* Details Metadata */}
        <div className="space-y-2 text-xs border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Mail className="w-3.5 h-3.5 text-zinc-300" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-zinc-300" />
            <span>{user.location}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-zinc-300" />
            <span>Joined {user.joinedDate}</span>
          </div>
        </div>

        {/* Mutual Connections */}
        {mutualsWithRoot.length > 0 && (
          <div className="space-y-2 border-t border-white/10 pt-4">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
              Mutual Connections ({mutualsWithRoot.length})
            </span>
            <div className="flex -space-x-2 overflow-hidden py-1">
              {mutualsWithRoot.slice(0, 5).map(m => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.name}
                  title={m.name}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-[#18181b] object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Connected Nodes List */}
        <div className="space-y-3 border-t border-white/10 pt-4">
          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
            Connected Nodes ({nodeConnections.length})
          </span>

          <div className="space-y-2">
            {nodeConnections.map(c => {
              const connectedUserId = c.sourceUserId === user.id ? c.targetUserId : c.sourceUserId;
              const connectedUser = getUserById(connectedUserId);
              if (!connectedUser) return null;

              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-white/5 hover:border-zinc-700 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={connectedUser.avatar}
                      alt={connectedUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-white/10"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-100 truncate">{connectedUser.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{c.connectionType}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
