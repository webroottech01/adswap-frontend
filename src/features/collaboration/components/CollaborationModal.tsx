'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/ui/Modal';

export interface CollaborationModalProps {
  show: boolean;
  onHide: () => void;
  receiverBusinessId: number;
  receiverBusinessName: string;
  onSubmit: (message: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  onClearError: () => void;
}

export function CollaborationModal({
  show,
  onHide,
  receiverBusinessName,
  onSubmit,
  loading,
  error,
  onClearError,
}: CollaborationModalProps) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (show) {
      setMessage('');
      onClearError();
    }
  }, [show, onClearError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    onSubmit(message.trim());
  };

  const footer = (
    <>
      <button type="button" className="btn btn-secondary" onClick={onHide} disabled={loading}>
        Cancel
      </button>
      <button
        type="submit"
        form="collaboration-form"
        className="btn btn-primary"
        disabled={loading || !message.trim()}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            Sending…
          </>
        ) : (
          'Send request'
        )}
      </button>
    </>
  );

  return (
    <Modal show={show} onHide={onHide} title={`Collaborate with ${receiverBusinessName}`} footer={footer}>
      <form id="collaboration-form" onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="collab-message" className="form-label">
            Message (proposal)
          </label>
          <textarea
            id="collab-message"
            className="form-control"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Introduce your business and what kind of collaboration you're looking for..."
            maxLength={2000}
            disabled={loading}
          />
          <div className="form-text">
            {message.length} / 2000
          </div>
        </div>
      </form>
    </Modal>
  );
}
