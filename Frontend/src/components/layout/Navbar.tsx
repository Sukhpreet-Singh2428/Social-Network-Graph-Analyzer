import React, { useState } from 'react';
import { Search, Moon, Sun, Bell, Filter, UserCheck, X } from 'lucide-react';
import { useGraph } from '../../context/GraphContext';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    theme,
    toggleTheme,
    communityFilter,
    setCommunityFilter,
    communities,
    users,
    setSelectedNodeId
  } = useGraph();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const searchResults = searchTerm.trim()
    ? users.filter(
        u =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.role.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectUserFromSearch = (userId: string) => {
    setSelectedNodeId(userId);
    setSearchTerm('');
    setIsSearchFocused(false);
    navigate('/network');
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800 text-zinc-200">
      {/* Search Input & Quick Filter */}
      <div className="relative flex items-center gap-3 w-full max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search graph nodes, users, roles..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full pl-10 pr-9 py-2 text-xs bg-zinc-900/60 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Quick Community Filter */}
        <div className="relative hidden sm:block">
          <select
            value={communityFilter}
            onChange={e => setCommunityFilter(e.target.value)}
            className="pl-8 pr-4 py-2 text-xs bg-zinc-900/60 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none focus:border-zinc-500 transition-all cursor-pointer font-medium appearance-none"
          >
            <option value="all">All Communities</option>
            {communities.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 py-2 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl z-50">
            <div className="px-3 py-1 text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
              Nodes Found ({searchResults.length})
            </div>
            {searchResults.map(u => (
              <button
                key={u.id}
                onClick={() => handleSelectUserFromSearch(u.id)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition-colors"
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-100 truncate">{u.name}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{u.role} • {u.communityName}</p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono uppercase font-bold">
                  View
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all border border-zinc-800"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-zinc-200" /> : <Moon className="w-4 h-4 text-zinc-800" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all border border-zinc-800"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-zinc-100" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 py-2 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl z-50 text-xs">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
                <span className="font-bold text-xs text-zinc-100 uppercase tracking-tight">Network Alerts</span>
                <span className="px-2 py-0.5 text-[9px] bg-zinc-800 text-zinc-300 rounded font-mono uppercase font-bold border border-zinc-700">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-zinc-800/60">
                <div className="p-3 hover:bg-white/5 transition-colors cursor-pointer">
                  <p className="text-zinc-200 font-bold text-xs">Community Density Alert</p>
                  <p className="text-zinc-400 text-[11px]">Tech Innovators reached 0.57 graph density threshold.</p>
                  <span className="text-[9px] text-zinc-500 font-mono uppercase">12 mins ago</span>
                </div>
                <div className="p-3 hover:bg-white/5 transition-colors cursor-pointer">
                  <p className="text-zinc-200 font-bold text-xs">High Centrality Node</p>
                  <p className="text-zinc-400 text-[11px]">Dr. Elena Rostova gained 2 new connections.</p>
                  <span className="text-[9px] text-zinc-500 font-mono uppercase">1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-zinc-800"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
              alt="Alex Mercer"
              className="w-8 h-8 rounded-full object-cover border border-zinc-700"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-zinc-200 leading-tight">Alex Mercer</span>
              <span className="text-[9px] text-zinc-400 font-mono uppercase leading-tight">Lead Analyst</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl z-50 text-xs">
              <div className="px-4 py-2 border-b border-zinc-800">
                <p className="font-bold text-zinc-100">Alex Mercer</p>
                <p className="text-zinc-400 text-[11px]">alex.mercer@network.io</p>
              </div>
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-white/5 text-zinc-300 font-medium transition-colors"
              >
                Graph Settings
              </button>
              <div className="px-4 py-2 border-t border-zinc-800 text-zinc-400 flex items-center gap-2 font-mono text-[9px] uppercase font-bold">
                <UserCheck className="w-3.5 h-3.5 text-zinc-200" />
                <span>ACTIVE SESSION</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
