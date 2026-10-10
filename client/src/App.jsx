import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

// Pages
import { Landing } from './pages/Landing.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { InterviewSetup } from './pages/InterviewSetup.jsx';
import { InterviewRoom } from './pages/InterviewRoom.jsx';
import { InterviewResults } from './pages/InterviewResults.jsx';
import { InterviewHistory } from './pages/InterviewHistory.jsx';
import { Profile } from './pages/Profile.jsx';

export const App = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Pages that don't need sidebar layout (landing, auth, full-screen room)
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);
  const isLiveRoom = location.pathname.startsWith('/room/');

  return (
    <>
      <Navbar />
      <div className="main-content">
        {isAuthenticated && !isPublicPage && !isLiveRoom ? (
          <div className="app-layout">
            <Sidebar />
            <main className="app-main">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/setup" element={<InterviewSetup />} />
                <Route path="/results/:id" element={<InterviewResults />} />
                <Route path="/history" element={<InterviewHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
            />

            {/* Live Room with full-screen container */}
            <Route
              path="/room/:id"
              element={
                <ProtectedRoute>
                  <main className="app-main" style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
                    <InterviewRoom />
                  </main>
                </ProtectedRoute>
              }
            />

            {/* Authenticated routes fallback for direct URL access */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="app-main">
                      <Dashboard />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/setup"
              element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="app-main">
                      <InterviewSetup />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/results/:id"
              element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="app-main">
                      <InterviewResults />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="app-main">
                      <InterviewHistory />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="app-main">
                      <Profile />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </>
  );
};
