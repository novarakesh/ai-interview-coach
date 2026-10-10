import React from 'react';
import { Check } from 'lucide-react';

export const ProgressIndicator = ({
  currentIndex,
  totalQuestions,
  answeredCount,
}) => {
  const steps = Array.from({ length: totalQuestions }, (_, i) => i);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        padding: '12px 0',
      }}
    >
      {steps.map((step) => {
        const isCompleted = step < answeredCount;
        const isCurrent = step === currentIndex;

        return (
          <React.Fragment key={step}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                transition: 'all 0.3s ease',
                background: isCompleted
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : isCurrent
                  ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                  : 'rgba(255, 255, 255, 0.06)',
                color: isCompleted || isCurrent ? '#fff' : '#64748b',
                border: isCurrent
                  ? '2px solid #a78bfa'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isCurrent ? '0 0 12px rgba(139, 92, 246, 0.5)' : 'none',
              }}
            >
              {isCompleted ? <Check size={16} /> : step + 1}
            </div>

            {step < totalQuestions - 1 && (
              <div
                style={{
                  flex: 1,
                  maxWidth: 60,
                  height: 3,
                  background: isCompleted
                    ? '#10b981'
                    : 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 2,
                  transition: 'background 0.3s ease',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
