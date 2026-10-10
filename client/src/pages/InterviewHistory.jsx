import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  PlayCircle,
  Briefcase,
  Calendar,
  Layers,
} from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import { interviewService } from '../services/interviewService.js';
import { InterviewCard } from '../components/InterviewCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { ErrorMessage } from '../components/ErrorMessage.jsx';
import { ConfirmationModal } from '../components/ConfirmationModal.jsx';

export const InterviewHistory = () => {
  const toast = useToast();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchInterviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await interviewService.getInterviews({
        role: selectedRole,
        interviewType: selectedType,
      });
      if (res.success) {
        setInterviews(res.interviews || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch interview history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [selectedRole, selectedType]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await interviewService.deleteInterview(deleteId);
      toast.success('Interview session deleted successfully.');
      setInterviews((prev) => prev.filter((i) => i._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete interview.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredInterviews = interviews.filter((i) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      i.role.toLowerCase().includes(query) ||
      i.interviewType.toLowerCase().includes(query) ||
      i.difficulty.toLowerCase().includes(query)
    );
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <History size={26} color="var(--accent-primary)" />
            <h1 style={{ fontSize: '2rem' }}>Interview History</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Review past mock interview sessions, review scoring metrics, and track progress.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by role or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
          <Search
            size={18}
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
          />
        </div>

        {/* Role Filter */}
        <div style={{ minWidth: '180px' }}>
          <select
            className="form-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="All" style={{ background: '#0f172a' }}>All Roles</option>
            <option value="MERN Stack Developer" style={{ background: '#0f172a' }}>MERN Stack</option>
            <option value="Frontend Developer" style={{ background: '#0f172a' }}>Frontend</option>
            <option value="Java Developer" style={{ background: '#0f172a' }}>Java</option>
            <option value="Python Developer" style={{ background: '#0f172a' }}>Python</option>
            <option value="Data Analyst" style={{ background: '#0f172a' }}>Data Analyst</option>
            <option value="HR Interview" style={{ background: '#0f172a' }}>HR Interview</option>
          </select>
        </div>

        {/* Type Filter */}
        <div style={{ minWidth: '160px' }}>
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="All" style={{ background: '#0f172a' }}>All Types</option>
            <option value="Technical" style={{ background: '#0f172a' }}>Technical</option>
            <option value="Behavioral" style={{ background: '#0f172a' }}>Behavioral</option>
            <option value="HR" style={{ background: '#0f172a' }}>HR</option>
            <option value="Mixed" style={{ background: '#0f172a' }}>Mixed</option>
          </select>
        </div>
      </div>

      {/* List / Content */}
      {loading ? (
        <LoadingSpinner text="Loading your interview sessions..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchInterviews} />
      ) : filteredInterviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredInterviews.map((interview) => (
            <InterviewCard
              key={interview._id}
              interview={interview}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<History size={32} />}
          title="No Matching Interviews"
          description={
            interviews.length === 0
              ? 'You have not conducted any mock interviews yet. Launch your first session to receive in-depth AI evaluations.'
              : 'No sessions match your search and filter criteria.'
          }
          actionText={interviews.length === 0 ? 'Start an Interview' : null}
          actionLink="/setup"
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteId}
        title="Delete Interview Record?"
        message="This will permanently remove this interview session and its evaluation results from your history."
        confirmText="Delete Record"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
