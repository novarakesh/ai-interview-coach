import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Sliders,
  Volume2,
  Save,
  LogOut,
  Calendar,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Input } from '../components/Input.jsx';
import { Select } from '../components/Select.jsx';
import { Button } from '../components/Button.jsx';

export const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferences?.preferredLanguage || 'en-US');
  const [voiceId, setVoiceId] = useState(user?.preferences?.voiceId || 'Namrita');
  const [defaultRole, setDefaultRole] = useState(user?.preferences?.defaultRole || 'MERN Stack Developer');
  const [defaultDifficulty, setDefaultDifficulty] = useState(user?.preferences?.defaultDifficulty || 'Intermediate');
  const [defaultInterviewType, setDefaultInterviewType] = useState(user?.preferences?.defaultInterviewType || 'Technical');
  const [saving, setSaving] = useState(false);

  const roles = [
    'MERN Stack Developer',
    'Frontend Developer',
    'Java Developer',
    'Python Developer',
    'Data Analyst',
    'HR Interview',
  ];

  const difficulties = [
    { value: 'Beginner', label: 'Beginner (Junior Level)' },
    { value: 'Intermediate', label: 'Intermediate (Mid Level)' },
    { value: 'Advanced', label: 'Advanced (Senior Level)' },
  ];

  const types = [
    { value: 'Technical', label: 'Technical Depth' },
    { value: 'Behavioral', label: 'Behavioral & STAR' },
    { value: 'HR', label: 'HR Screening' },
    { value: 'Mixed', label: 'Mixed Comprehensive' },
  ];

  const voices = [
    { value: 'Namrita', label: 'Namrita (Indian English - Professional Female)' },
    { value: 'en-US-marcus', label: 'Marcus (US English - Confident Male)' },
    { value: 'en-US-alicia', label: 'Alicia (US English - Warm Female)' },
  ];

  const languages = [
    { value: 'en-US', label: 'English (United States)' },
    { value: 'en-GB', label: 'English (United Kingdom)' },
    { value: 'en-IN', label: 'English (India)' },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name,
        preferences: {
          preferredLanguage,
          voiceId,
          defaultRole,
          defaultDifficulty,
          defaultInterviewType,
        },
      });
      toast.success('Profile and interview preferences updated successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <div className="animate-fade-in" style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Profile Card */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
              boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)',
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '4px' }}>{user?.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={14} />
                {user?.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} />
                Member since {memberSince}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-danger btn-sm"
          style={{ padding: '8px 16px' }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Account Details */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <User size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Account Information</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <Input
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              iconLeft={<User size={18} />}
              required
            />

            <Input
              label="Registered Email (Read Only)"
              value={user?.email || ''}
              disabled
              iconLeft={<Mail size={18} />}
            />
          </div>
        </div>

        {/* Interview Preferences */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Sliders size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Default Interview Preferences</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <Select
              label="Default Target Role"
              options={roles}
              value={defaultRole}
              onChange={(e) => setDefaultRole(e.target.value)}
            />

            <Select
              label="Default Difficulty Level"
              options={difficulties}
              value={defaultDifficulty}
              onChange={(e) => setDefaultDifficulty(e.target.value)}
            />

            <Select
              label="Default Interview Style"
              options={types}
              value={defaultInterviewType}
              onChange={(e) => setDefaultInterviewType(e.target.value)}
            />

            <Select
              label="Interviewer Voice (Murf FALCON)"
              options={voices}
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
            />

            <Select
              label="Preferred Language"
              options={languages}
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
            />
          </div>
        </div>

        {/* Save Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <Button type="submit" variant="primary" size="lg" loading={saving} style={{ padding: '12px 32px' }}>
            <Save size={18} />
            Save Profile & Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
