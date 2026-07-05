/**
 * Componente App atualizado com Contextos e Rotas
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Analyzer from './pages/Analyzer';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="loading">⏳ Carregando...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element=(
          <ProtectedRoute>
            <Analyzer />
          </ProtectedRoute>
        )
      />

      <Route
        path="/analyzer"
        element=(
          <ProtectedRoute>
            <Analyzer />
          </ProtectedRoute>
        )
      />

      {/* Redirect */}
      <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ResumeProvider>
          <AppContent />
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
