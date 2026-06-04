'use client';

interface WordCountTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minWords?: number;
  maxWords?: number;
  helperText?: string;
  error?: string;
  rows?: number;
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function WordCountTextarea({
  label,
  value,
  onChange,
  minWords = 50,
  maxWords = 300,
  helperText,
  error,
  rows = 5,
}: WordCountTextareaProps) {
  const words = countWords(value);
  const isEmpty = !value.trim();
  const outOfRange = !isEmpty && (words < minWords || words > maxWords);

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      {helperText && <p className="text-muted small">{helperText}</p>}
      <textarea
        className={`form-control ${error ? 'is-invalid' : ''}`}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="d-flex justify-content-between small mt-1">
        <span className={outOfRange ? 'text-warning' : 'text-muted'}>
          {words} / {minWords}–{maxWords} words{isEmpty ? ' (optional)' : ''}
        </span>
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
