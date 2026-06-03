'use client';

import { useState } from 'react';
import { FileDropzone, type PendingFile } from '@/shared/forms/FileDropzone';

export interface MessageSendPayload {
  text?: string;
  files: File[];
}

interface MessageInputProps {
  pendingFiles: PendingFile[];
  onPendingFilesChange: (files: PendingFile[]) => void;
  onSend: (payload: MessageSendPayload) => void;
  loading: boolean;
  error: string | null;
  onClearError: () => void;
}

export function MessageInput({
  pendingFiles,
  onPendingFilesChange,
  onSend,
  loading,
  error,
  onClearError,
}: MessageInputProps) {
  const [value, setValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const canSend =
    !loading && (value.trim().length > 0 || pendingFiles.length > 0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSend) return;

    onSend({
      text: value.trim() || undefined,
      files: pendingFiles.map((p) => p.file),
    });
    setValue('');
    pendingFiles.forEach((p) => {
      if (p.preview) URL.revokeObjectURL(p.preview);
    });
    onPendingFilesChange([]);
  };

  const handleCardDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (loading) return;
    const incoming = Array.from(e.dataTransfer.files);
    if (incoming.length === 0) return;
    const next: PendingFile[] = [...pendingFiles];
    incoming.forEach((file) => {
      const entry: PendingFile = { file };
      if (file.type.startsWith('image/')) {
        entry.preview = URL.createObjectURL(file);
      }
      next.push(entry);
    });
    onPendingFilesChange(next);
  };

  return (
    <div
      className={`card mt-3 position-relative ${isDragging ? 'border-primary border-2' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!loading) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleCardDrop}
    >
      {isDragging && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded"
          style={{
            backgroundColor: 'rgba(13, 110, 253, 0.08)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <span className="text-primary fw-semibold small">Drop files to attach</span>
        </div>
      )}
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
            <FileDropzone
              files={pendingFiles}
              onChange={onPendingFilesChange}
              disabled={loading}
              compact
              label="Drop images or PDF here, or click to browse"
            />
          </div>
          <div className="mb-2">
            <textarea
              className="form-control"
              rows={3}
              placeholder="Type a message (optional caption for attachments)..."
              value={value}
              onChange={(event) => setValue(event.target.value)}
              disabled={loading}
            />
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={!canSend}>
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
