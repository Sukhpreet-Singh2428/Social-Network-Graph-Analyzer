import React, { useState, useEffect } from 'react';
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

  const [sourceId, setSourceId] = useState<string>('');
  const [targetId, setTargetId] = useState<string>('');
  const [type, setType] = useState<Connection['connectionType']>('Colleague');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && users.length > 0) {
      setSourceId(users[0]?.id || '');
      setTargetId(users[1]?.id || users[0]?.id || '');
      setIsSubmitting(false);
    }
  }, [isOpen, users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) return;

    setIsSubmitting(true);
    const success = await addConnection(sourceId, targetId, type);
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Edge Connection"
      subtitle="Connect two user nodes via Spring Boot POST /api/friendships."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Source User Node (User 1)
          </label>
          <select
            value={sourceId}
            disabled={isSubmitting || users.length === 0}
            onChange={e => setSourceId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-zinc-300 cursor-pointer font-medium disabled:opacity-50"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} (ID: {u.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Target User Node (User 2)
          </label>
          <select
            value={targetId}
            disabled={isSubmitting || users.length === 0}
            onChange={e => setTargetId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-zinc-300 cursor-pointer font-medium disabled:opacity-50"
          >
            {users.map(u => (
              <option key={u.id} value={u.id} disabled={u.id === sourceId}>
                {u.name} (ID: {u.id}) {u.id === sourceId ? '(Same Node)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Connection Relationship Type (UI Display)
          </label>
          <select
            value={type}
            disabled={isSubmitting}
            onChange={e => setType(e.target.value as Connection['connectionType'])}
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-zinc-300 cursor-pointer font-medium disabled:opacity-50"
          >
            <option value="Colleague">Colleague (Professional)</option>
            <option value="Friend">Friend (Social)</option>
            <option value="Collaborator">Collaborator (Project)</option>
            <option value="Mentor">Mentor (Advisory)</option>
          </select>
          <p className="text-[10px] text-zinc-500 mt-1 font-mono">
            Note: Relationship type is a presentational field on the frontend.
          </p>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !sourceId || !targetId || sourceId === targetId}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider disabled:opacity-50"
          >
            <Link2 className="w-4 h-4" />
            {isSubmitting ? 'Connecting...' : 'Connect Nodes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
