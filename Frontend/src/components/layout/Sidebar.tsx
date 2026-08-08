import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Network,
  Users,
  GitCommit,
  Route,
  Users2,
  Sparkles,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Share2,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/network', label: 'Network Graph', icon: Network, badge: 'Canvas' },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/connections', label: 'Connections', icon: GitCommit },
    { path: '/path-finder', label: 'Path Finder', icon: Route },
    { path: '/communities', label: 'Communities', icon: Users2 },
    { path: '/suggestions', label: 'Suggestions', icon: Sparkles },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col h-screen border-r border-zinc-800 bg-[#09090b] text-zinc-200 transition-all duration-300 select-none ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 font-bold shadow-xs shrink-0">
            <Share2 className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-xs tracking-tight text-zinc-100 uppercase">
                NetPulse
              </span>
              <span className="text-[9px] text-zinc-500 font-mono font-semibold tracking-widest uppercase">
                Graph Analyzer
              </span>
            </div>
          )}
        </NavLink>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center w-6 h-6 rounded bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500">
            Navigation
          </div>
        )}
        {navItems.map(item => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs tracking-tight transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-zinc-800/90 text-zinc-50 border-l-2 border-zinc-100 font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent
                    className={`w-4 h-4 transition-transform duration-150 shrink-0 ${
                      isActive ? 'text-zinc-50' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="px-1.5 py-0.5 text-[8px] font-mono uppercase font-bold bg-zinc-900 text-zinc-400 rounded border border-zinc-800">
                      {item.badge}
                    </span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-zinc-900 text-zinc-100 text-xs rounded shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-zinc-800">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Status */}
      <div className="p-3 border-t border-zinc-800 bg-[#09090b]">
        {!collapsed ? (
          <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-zinc-200 text-[11px]">Mock Graph Store</p>
              <p className="text-[9px] font-mono text-zinc-500 uppercase">20 Nodes • 27 Edges</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1 text-zinc-400" title="Mock Graph Store">
            <ShieldCheck className="w-4 h-4" />
          </div>
        )}
      </div>
    </aside>
  );
};
