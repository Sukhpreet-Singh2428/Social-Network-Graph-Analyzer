import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useGraph } from '../../context/GraphContext';
import type { Connection } from '../../types';
import { Link2 } from 'lucide-react';

interface AddConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddConnectionModal: React.FC<AddConnectionModalProps> = ({ isOpen, onClose }) => {
  const { users, addConnection } = useGraph();

  const [sourceId, setSourceId] = useState(users[0]?.id || '');
  const [targetId, setTargetId] = useState(users[1]?.id || '');
  const [type, setType] = useState<Connection['connectionType']>('Colleague');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) return;

    addConnection(sourceId, targetId, type);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Edge Connection"
      subtitle="Connect two user nodes to model friendship or professional affiliation."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Source User Node
          </label>
          <select
            value={sourceId}
            onChange={e => setSourceId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-zinc-300 cursor-pointer font-medium"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.communityName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Target User Node
          </label>
          <select
            value={targetId}
            onChange={e => setTargetId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-zinc-300 cursor-pointer font-medium"
          >
            {users.map(u => (
              <option key={u.id} value={u.id} disabled={u.id === sourceId}>
                {u.name} ({u.communityName}) {u.id === sourceId ? '(Same Node)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Connection Relationship Type
          </label>
          <select
            value={type}
            onChange={e => setType(e.target.value as Connection['connectionType'])}
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-zinc-300 cursor-pointer font-medium"
          >
            <option value="Colleague">Colleague (Professional)</option>
            <option value="Friend">Friend (Social)</option>
            <option value="Collaborator">Collaborator (Project)</option>
            <option value="Mentor">Mentor (Advisory)</option>
          </select>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={sourceId === targetId}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider disabled:opacity-50"
          >
            <Link2 className="w-4 h-4" />
            Connect Nodes
          </button>
        </div>
      </form>
    </Modal>
  );
};
