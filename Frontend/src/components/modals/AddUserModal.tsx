import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useGraph } from '../../context/GraphContext';
import { UserPlus, Info } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { users, addUser } = useGraph();

  const [idInput, setIdInput] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto-suggest next integer ID based on current max numeric ID in state
  useEffect(() => {
    if (isOpen) {
      const maxId = users.reduce((max, u) => {
        const parsed = parseInt(u.id, 10);
        return !isNaN(parsed) ? Math.max(max, parsed) : max;
      }, 0);
      setIdInput(String(maxId + 1));
      setName('');
      setIsSubmitting(false);
    }
  }, [isOpen, users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numId = parseInt(idInput, 10);

    if (isNaN(numId) || numId < 1) {
      return;
    }
    if (!name.trim()) return;

    setIsSubmitting(true);
    const success = await addUser(numId, name.trim());
    setIsSubmitting(false);

    if (success) {
      setName('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New User Node"
      subtitle="Create a new user node in the Spring Boot backend graph store."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
            User ID (Integer) *
          </label>
          <input
            type="number"
            required
            min={1}
            step={1}
            disabled={isSubmitting}
            placeholder="e.g. 1, 2, 10"
            value={idInput}
            onChange={e => setIdInput(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-300 font-medium disabled:opacity-50"
          />
          <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 font-mono">
            <Info className="w-3 h-3 text-zinc-400 inline" />
            Client-supplied integer ID required by backend endpoint POST /api/users.
          </p>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            disabled={isSubmitting}
            placeholder="e.g. Jordan Lee"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-300 font-medium disabled:opacity-50"
          />
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
            disabled={isSubmitting || !name.trim() || !idInput}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            {isSubmitting ? 'Creating...' : 'Add User Node'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
