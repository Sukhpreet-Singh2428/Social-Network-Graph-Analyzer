import React from 'react';
import { Modal } from '../common/Modal';
import { useGraph } from '../../context/GraphContext';
import type { Connection } from '../../types';
import { Trash2, AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  connection: Connection | null;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  connection
}) => {
  const { deleteConnection } = useGraph();

  if (!connection) return null;

  const handleConfirm = () => {
    deleteConnection(connection.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Edge Connection"
      subtitle="Confirm removal of graph relationship edge."
    >
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-zinc-900 border border-white/10 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-zinc-100 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300">
            <p className="font-bold text-zinc-100 uppercase tracking-tight">Warning: Graph Topology Change</p>
            <p className="mt-1 text-zinc-400">
              Removing the edge between <span className="text-white font-medium">{connection.sourceUserName}</span> and{' '}
              <span className="text-white font-medium">{connection.targetUserName}</span> will update centrality scores and shortest path connectivity.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-zinc-900 border border-white/5 text-xs space-y-1 text-zinc-400 font-mono">
          <p><span className="text-zinc-500">Connection ID:</span> {connection.id}</p>
          <p><span className="text-zinc-500">Relationship Type:</span> {connection.connectionType}</p>
          <p><span className="text-zinc-500">Connected Since:</span> {connection.connectedSince}</p>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider"
          >
            <Trash2 className="w-4 h-4" />
            Delete Connection
          </button>
        </div>
      </div>
    </Modal>
  );
};
