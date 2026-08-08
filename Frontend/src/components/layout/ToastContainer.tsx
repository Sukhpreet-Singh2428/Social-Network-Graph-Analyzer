import React from 'react';
import { useGraph } from '../../context/GraphContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGraph();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-zinc-100 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-zinc-100 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-zinc-300 shrink-0" />,
          info: <Info className="w-4 h-4 text-zinc-300 shrink-0" />
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-2xl backdrop-blur-md transition-all duration-200"
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-100">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-zinc-400 mt-0.5">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
