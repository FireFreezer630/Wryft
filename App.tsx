
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './components/LandingPage';
import PublicProfile from './components/PublicProfile';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Protected Dashboard Routes */}
                <Route path="/dashboard/*" element={<DashboardLayout />} />

                {/* Public Profile Route (Must be before fallback) */}
                <Route path="/:username" element={<PublicProfile />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    </AuthProvider>
  );
};

export default App;
