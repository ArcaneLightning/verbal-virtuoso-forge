import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './App.css';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Debate from './pages/Debate';
import Teams from './pages/Teams';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AchievementsPage from './pages/AchievementsPage';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/practice" element={
              <ProtectedRoute>
                <Layout>
                  <Practice />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/debate" element={
              <ProtectedRoute>
                <Layout>
                  <Debate />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute>
                <Layout>
                  <Teams />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Layout>
                  <AnalyticsPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/achievements" element={
              <ProtectedRoute>
                <Layout>
                  <AchievementsPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect to dashboard if authenticated, otherwise to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
