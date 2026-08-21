import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useGraph } from '../../context/GraphContext';
import type { Connection, User } from '../../types';
import { Trash2, AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  connection?: Connection | null;
  user?: User | null;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  connection,
  user
}) => {
  const { deleteConnection, deleteUser } = useGraph();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!connection && !user) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    let success = false;

    if (user) {
      success = await deleteUser(user.id);
    } else if (connection) {
      success = await deleteConnection(connection.id);
    }

    setIsDeleting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Delete User Node' : 'Delete Edge Connection'}
      subtitle={
        user
          ? 'Confirm removal of user node from graph store (DELETE /api/users/{id}).'
          : 'Confirm removal of graph relationship edge (DELETE /api/friendships).'
      }
    >
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-zinc-900 border border-white/10 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-zinc-100 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300">
            <p className="font-bold text-zinc-100 uppercase tracking-tight">
              Warning: Graph Topology Change
            </p>
            {user ? (
              <p className="mt-1 text-zinc-400">
                Deleting user <span className="text-white font-medium">{user.name}</span> (ID: {user.id}) will permanently remove the user and all associated friendship edges from the graph.
              </p>
            ) : (
              <p className="mt-1 text-zinc-400">
                Removing the edge between <span className="text-white font-medium">{connection?.sourceUserName}</span> and{' '}
                <span className="text-white font-medium">{connection?.targetUserName}</span> will update centrality scores and shortest path connectivity.
              </p>
            )}
          </div>
        </div>

        {user ? (
          <div className="p-3 rounded-lg bg-zinc-900 border border-white/5 text-xs space-y-1 text-zinc-400 font-mono">
            <p><span className="text-zinc-500">User ID:</span> {user.id}</p>
            <p><span className="text-zinc-500">Name:</span> {user.name}</p>
            <p><span className="text-zinc-500">Role:</span> {user.role}</p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-zinc-900 border border-white/5 text-xs space-y-1 text-zinc-400 font-mono">
            <p><span className="text-zinc-500">Connection ID:</span> {connection?.id}</p>
            <p><span className="text-zinc-500">Relationship Type:</span> {connection?.connectionType}</p>
            <p><span className="text-zinc-500">Connected Since:</span> {connection?.connectedSince}</p>
          </div>
        )}

        <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : user ? 'Delete User Node' : 'Delete Connection'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
