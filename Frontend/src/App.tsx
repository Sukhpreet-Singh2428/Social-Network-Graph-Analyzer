import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GraphProvider } from './context/GraphContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/layout/ToastContainer';

// 9 Required Pages
import { DashboardPage } from './pages/Dashboard';
import { NetworkGraphPage } from './pages/NetworkGraphPage';
import { UsersPage } from './pages/UsersPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { PathFinderPage } from './pages/PathFinderPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { SuggestionsPage } from './pages/SuggestionsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <GraphProvider>
      <Router>
        <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f19] text-gray-100 font-sans">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Area */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto relative">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/network" element={<NetworkGraphPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/connections" element={<ConnectionsPage />} />
                <Route path="/path-finder" element={<PathFinderPage />} />
                <Route path="/communities" element={<CommunitiesPage />} />
                <Route path="/suggestions" element={<SuggestionsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>

          {/* Toast Container */}
          <ToastContainer />
        </div>
      </Router>
    </GraphProvider>
  );
};

export default App;
