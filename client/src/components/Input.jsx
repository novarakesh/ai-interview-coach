import React from 'react';

export const Input = ({
  label,
  error,
  iconLeft,
  iconRight,
  id,
  type = 'text',
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {iconLeft && <span className="input-icon-left">{iconLeft}</span>}
        <input
          id={inputId}
          type={type}
          className={`form-input ${iconLeft ? 'has-icon-left' : ''} ${
            iconRight ? 'has-icon-right' : ''
          } ${className}`}
          {...props}
        />
        {iconRight && <span className="input-icon-right">{iconRight}</span>}
      </div>
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
};

export const Select = ({
  label,
  error,
  options = [],
  id,
  className = '',
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        <select
          id={selectId}
          className={`form-select ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={typeof opt === 'object' ? opt.value : opt}
              value={typeof opt === 'object' ? opt.value : opt}
              style={{ background: '#0f172a', color: '#fff' }}
            >
              {typeof opt === 'object' ? opt.label : opt}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
};
