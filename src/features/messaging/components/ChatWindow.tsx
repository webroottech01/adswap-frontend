'use client';

import type { Message } from '../types';
import { ChatMessagesSkeleton } from './ChatWindowSkeleton';
import {
  isImageAttachment,
  resolveMessageAttachmentUrl,
} from '../utils/messageMediaUrl';

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  currentBusinessId?: number | null;
  conversationTitle?: string | null;
  onFilesDropped?: (files: File[]) => void;
  isDragOver?: boolean;
}

function MessageBubbleContent({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  const attachment = message.attachment;
  const caption = message.message_text?.trim() ?? '';

  return (
    <div
      className="rounded px-3 py-2"
      style={{
        maxWidth: '75%',
        backgroundColor: isOwn ? '#0d6efd' : '#6b7c3e',
        color: '#fff',
      }}
    >
      {attachment && (
        <div className="mb-1">
          {isImageAttachment(attachment.mime_type) ? (
            <a
              href={resolveMessageAttachmentUrl(attachment)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={resolveMessageAttachmentUrl(attachment)}
                alt={attachment.file_name}
                className="rounded"
                style={{ maxWidth: '100%', maxHeight: 240, display: 'block' }}
              />
            </a>
          ) : (
            <a
              href={resolveMessageAttachmentUrl(attachment)}
              target="_blank"
              rel="noopener noreferrer"
              className={isOwn ? 'link-light' : 'link-light'}
              style={{ wordBreak: 'break-word' }}
            >
              Open PDF: {attachment.file_name}
            </a>
          )}
        </div>
      )}
      {caption !== '' && <p className="mb-0 small">{caption}</p>}
      <div className="mt-1" style={{ fontSize: '0.65rem', opacity: 0.85 }}>
        {new Date(message.created_at).toLocaleString()}
      </div>
    </div>
  );
}

export function ChatWindow({
  messages,
  loading,
  error,
  currentBusinessId,
  conversationTitle,
  onFilesDropped,
  isDragOver = false,
}: ChatWindowProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!onFilesDropped) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesDropped(files);
    }
  };

  return (
    <div
      className={`card h-100 d-flex flex-column position-relative ${
        isDragOver ? 'border-primary border-2' : ''
      }`}
      onDragOver={(e) => {
        if (!onFilesDropped) return;
        e.preventDefault();
      }}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded"
          style={{
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          <span className="text-primary fw-semibold">Drop files to attach</span>
        </div>
      )}
      <div className="card-header d-flex justify-content-between align-items-center min-w-0">
        <h2
          className="h6 mb-0 text-truncate flex-grow-1 min-w-0"
          title={conversationTitle ?? undefined}
        >
          {conversationTitle ?? 'Messages'}
        </h2>
      </div>
      <div
        className="card-body flex-grow-1"
        style={{
          maxHeight: 400,
          overflowY: 'auto',
        }}
      >
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading && messages.length === 0 ? (
          <ChatMessagesSkeleton />
        ) : messages.length === 0 ? (
          <p className="text-muted mb-0">No messages in this conversation yet.</p>
        ) : (
          <ul className="list-unstyled mb-0">
            {messages.map((message) => {
              if (message.type === 'system') {
                return (
                  <li key={message.id} className="my-3 text-center">
                    <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                      {message.message_text}
                    </span>
                  </li>
                );
              }

              const isOwn =
                currentBusinessId != null &&
                message.sender_business_id === currentBusinessId;

              return (
                <li
                  key={message.id}
                  className={`mb-3 d-flex ${isOwn ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <MessageBubbleContent message={message} isOwn={isOwn} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
