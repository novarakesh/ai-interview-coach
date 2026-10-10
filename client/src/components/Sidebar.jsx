import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlayCircle,
  History,
  User,
  Sparkles,
  Award,
} from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-nav">
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#64748b',
            letterSpacing: '0.08em',
            padding: '8px 12px',
          }}
        >
          Menu
        </div>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/setup"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <PlayCircle size={18} />
          <span>Start Interview</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <History size={18} />
          <span>Interview History</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <User size={18} />
          <span>Profile & Settings</span>
        </NavLink>
      </div>

      {/* Pro Practice Card / Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.25)',
            color: '#a78bfa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 8px',
          }}
        >
          <Sparkles size={18} />
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: 4 }}>
          Murf TTS + Gemini 2.5
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: 12 }}>
          Ultra-realistic voice questions & in-depth multi-metric answer scoring.
        </div>
        <NavLink
          to="/setup"
          className="btn btn-primary btn-sm"
          style={{ width: '100%', fontSize: '0.8rem' }}
        >
          Launch Mock Session
        </NavLink>
      </div>
    </aside>
  );
};
