'use client';

import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
}

export function TagInput({ label, value, onChange, placeholder, error }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
  };

  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <div className="border rounded p-2">
        <div className="d-flex flex-wrap gap-1 mb-2">
          {value.map((tag) => (
            <span key={tag} className="badge bg-secondary d-flex align-items-center gap-1">
              {tag}
              <button
                type="button"
                className="btn-close btn-close-white"
                style={{ fontSize: '0.5rem' }}
                aria-label={`Remove ${tag}`}
                onClick={() => onChange(value.filter((t) => t !== tag))}
              />
            </span>
          ))}
        </div>
        <input
          type="text"
          className="form-control form-control-sm border-0"
          placeholder={placeholder ?? 'Type and press Enter'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => input && addTag(input)}
        />
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
