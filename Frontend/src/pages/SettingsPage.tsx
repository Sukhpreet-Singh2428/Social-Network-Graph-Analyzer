import React, { useState } from 'react';
import { useGraph } from '../context/GraphContext';
import { Settings, Moon, Sun, Download, Upload } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    theme,
    toggleTheme,
    nodeLabelsVisible,
    setNodeLabelsVisible,
    users,
    connections,
    communities,
    addToast
  } = useGraph();

  const [graphAlerts, setGraphAlerts] = useState(true);
  const [autoClustering, setAutoClustering] = useState(true);

  const handleExportData = () => {
    const payload = JSON.stringify({ users, connections, communities }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graph_network_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    addToast('Graph Exported', 'Downloaded mock graph topology JSON payload.', 'success');
  };

  const handleImportPlaceholder = () => {
    addToast('Import Ready', 'Import parser placeholder activated. Ready for real JSON graph payload.', 'info');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2 tracking-tight">
          <Settings className="w-6 h-6 text-zinc-100" />
          Application & Graph Settings
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Customize visualization themes, graph preferences, notification alerts, and mock data backups.
        </p>
      </div>

      {/* 1. Appearance Settings */}
      <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-4">
        <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-widest">
          Appearance & Themes
        </h3>

        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900 border border-white/5">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-zinc-200 uppercase tracking-tight">Color Theme Mode</p>
            <p className="text-xs text-zinc-400">Toggle between Dark SaaS Mode and Light Mode.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-sm transition-colors uppercase tracking-wider"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-zinc-950" /> : <Moon className="w-4 h-4 text-zinc-950" />}
            <span>Active: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </div>

      {/* 2. Graph Canvas Preferences */}
      <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-4">
        <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-widest">
          Graph Canvas Preferences
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900 border border-white/5">
            <div>
              <p className="text-xs font-bold text-zinc-200 uppercase tracking-tight">Show Node Labels</p>
              <p className="text-xs text-zinc-400">Display user names directly under canvas node vertices.</p>
            </div>
            <button
              onClick={() => setNodeLabelsVisible(!nodeLabelsVisible)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                nodeLabelsVisible ? 'bg-zinc-100' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-zinc-950 transition-transform ${
                  nodeLabelsVisible ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900 border border-white/5">
            <div>
              <p className="text-xs font-bold text-zinc-200 uppercase tracking-tight">Community Auto-Clustering</p>
              <p className="text-xs text-zinc-400">Group node coordinates around community cluster centers.</p>
            </div>
            <button
              onClick={() => setAutoClustering(!autoClustering)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                autoClustering ? 'bg-zinc-100' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-zinc-950 transition-transform ${
                  autoClustering ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Notifications */}
      <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-4">
        <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-widest">
          Notifications & Alerts
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900 border border-white/5">
            <div>
              <p className="text-xs font-bold text-zinc-200 uppercase tracking-tight">Network Topology Alerts</p>
              <p className="text-xs text-zinc-400">Notify when graph density or hub centrality changes.</p>
            </div>
            <button
              onClick={() => setGraphAlerts(!graphAlerts)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                graphAlerts ? 'bg-zinc-100' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-zinc-950 transition-transform ${
                  graphAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mock Data Import / Export */}
      <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-4">
        <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-widest">
          Mock Data Backup & Export
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 p-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-colors uppercase tracking-wider shadow-xs"
          >
            <Download className="w-4 h-4" />
            Export Graph JSON Backup
          </button>
          <button
            onClick={handleImportPlaceholder}
            className="flex items-center justify-center gap-2 p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-bold text-xs transition-colors uppercase tracking-wider"
          >
            <Upload className="w-4 h-4" />
            Import Graph Data (Placeholder)
          </button>
        </div>
      </div>

      {/* 5. Account Info Placeholder */}
      <div className="p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-sm space-y-3">
        <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-widest">
          Analyst Profile & Session
        </h3>
        <div className="p-4 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
              alt="Alex Mercer"
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
            <div>
              <p className="font-bold text-zinc-100">Alex Mercer</p>
              <p className="text-zinc-400">alex.mercer@network.io • Lead Analyst</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 font-mono font-bold text-[10px] uppercase">
            Frontend Standalone
          </span>
        </div>
      </div>
    </div>
  );
};
