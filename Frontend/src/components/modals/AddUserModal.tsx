import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useGraph } from '../../context/GraphContext';
import type { CommunityId } from '../../types';
import { UserPlus } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { addUser, communities } = useGraph();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [communityId, setCommunityId] = useState<CommunityId>('c1');
  const [location, setLocation] = useState('San Francisco, CA');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    const comm = communities.find(c => c.id === communityId);

    addUser({
      name,
      username: username.startsWith('@') ? username : `@${username}`,
      email: email || `${username.replace('@', '')}@network.io`,
      role: role || 'Member',
      communityId,
      communityName: comm ? comm.name : 'Tech Innovators',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 10000000)}?auto=format&fit=crop&q=80&w=250`,
      location
    });

    setName('');
    setUsername('');
    setEmail('');
    setRole('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New User Node"
      subtitle="Create a new profile entity in the network graph."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Jordan Lee"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-300 font-medium"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Username *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. @jordan_lee"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-300 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Role / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Graph Specialist"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Community Cluster
            </label>
            <select
              value={communityId}
              onChange={e => setCommunityId(e.target.value as CommunityId)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-zinc-300 cursor-pointer font-medium"
            >
              {communities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. San Francisco, CA"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-300 font-medium"
          />
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
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider"
          >
            <UserPlus className="w-4 h-4" />
            Add User Node
          </button>
        </div>
      </form>
    </Modal>
  );
};
