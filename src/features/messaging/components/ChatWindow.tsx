'use client';

import type { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export function ChatWindow({ messages, loading, error }: ChatWindowProps) {
  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h6 mb-0">Messages</h2>
      </div>
      <div
        className="card-body"
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
          <div className="d-flex justify-content-center align-items-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading…</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-muted mb-0">No messages in this conversation yet.</p>
        ) : (
          <ul className="list-unstyled mb-0">
            {messages.map((message) => (
              <li key={message.id} className="mb-3">
                <div className="small text-muted mb-1">
                  <span className="fw-semibold">Business #{message.sender_business_id}</span>{' '}
                  <span>
                    • {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded bg-light">
                  <p className="mb-0">{message.message_text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

