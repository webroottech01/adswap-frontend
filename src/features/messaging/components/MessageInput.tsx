'use client';

import { useState } from 'react';

interface MessageInputProps {
  onSend: (messageText: string) => void;
  loading: boolean;
  error: string | null;
  onClearError: () => void;
}

export function MessageInput({ onSend, loading, error, onClearError }: MessageInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!value.trim() || loading) return;
    onSend(value.trim());
    setValue('');
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClearError}
            />
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <textarea
              className="form-control"
              rows={3}
              placeholder="Type a message..."
              value={value}
              onChange={(event) => setValue(event.target.value)}
              disabled={loading}
            />
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !value.trim()}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Sending…
                </>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

