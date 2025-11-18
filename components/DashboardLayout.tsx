
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import Dashboard from './Dashboard';
import Settings from './Settings';
import Customization from './Customization';

// Placeholder for empty dashboard pages
const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="p-8 text-gray-500 flex items-center justify-center h-full">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p>This feature is under construction.</p>
        </div>
    </div>
);

const DashboardLayout = () => {
  const { user } = useAuth();

  // In a real app, redirect if not authenticated
  // if (!user) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen bg-[#050505] font-sans text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative ml-72 overflow-y-auto h-screen custom-scrollbar">
        <Routes>
             <Route index element={<Navigate to="overview" replace />} />
             <Route path="overview" element={<Dashboard />} />
             <Route path="settings" element={<Settings />} />
             <Route path="customize" element={<Customization />} />
             
             {/* Placeholders for other menu items */}
             <Route path="ai" element={<PlaceholderPage title="AI Assistant" />} />
             <Route path="layout" element={<PlaceholderPage title="Layout Editor" />} />
             <Route path="decoration" element={<PlaceholderPage title="Decorations" />} />
             <Route path="premium" element={<PlaceholderPage title="Premium Features" />} />
             <Route path="socials" element={<PlaceholderPage title="Social Links" />} />
             <Route path="content" element={<PlaceholderPage title="Content Manager" />} />
             <Route path="apps" element={<PlaceholderPage title="Applications" />} />
             <Route path="uploads" element={<PlaceholderPage title="Image Host" />} />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardLayout;
