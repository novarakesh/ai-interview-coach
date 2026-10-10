import React from 'react';

export const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  return (
    <div className="spinner-container animate-fade-in">
      <div className="custom-spinner" />
      {text && (
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {text}
        </span>
      )}
    </div>
  );
};
