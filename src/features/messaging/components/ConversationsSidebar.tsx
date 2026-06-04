'use client';

import Link from 'next/link';
import type { ConversationListItem, ConversationsMeta } from '../types';
import { displayConversationTitle } from '../utils/conversationTitle';
import { ConversationsSidebarSkeleton } from './ConversationsSidebarSkeleton';

interface ConversationsSidebarProps {
  conversations: ConversationListItem[] | undefined;
  meta: ConversationsMeta | null;
  activeId?: number;
  loading: boolean;
  error: string | null;
  onPageChange?: (page: number) => void;
}

export function ConversationsSidebar({
  conversations,
  meta,
  activeId,
  loading,
  error,
  onPageChange,
}: ConversationsSidebarProps) {
  const items = Array.isArray(conversations) ? conversations : [];

  return (
    <div className="card h-100">
      <div className="card-header">
        <h2 className="h6 mb-0">Conversations</h2>
      </div>
      <div className="card-body p-0" style={{ maxHeight: 500, overflowY: 'auto' }}>
        {error && (
          <div className="alert alert-danger m-3" role="alert">
            {error}
          </div>
        )}

        {loading && items.length === 0 ? (
          <ConversationsSidebarSkeleton />
        ) : items.length === 0 ? (
          <div className="text-center text-muted py-4">
            <p className="mb-0">No conversations yet.</p>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {items.map((conversation) => (
              <li
                key={conversation.id}
                className={`list-group-item list-group-item-action ${
                  activeId === conversation.id ? 'active' : ''
                }`}
              >
                <Link
                  href={`/messages/${conversation.id}`}
                  className={`d-block text-decoration-none ${
                    activeId === conversation.id ? 'text-white' : 'text-body'
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1 gap-2">
                    <span
                      className="fw-semibold text-truncate min-w-0 flex-grow-1"
                      title={displayConversationTitle(conversation)}
                    >
                      {displayConversationTitle(conversation)}
                    </span>
                    <span className="small text-muted">
                      {new Date(conversation.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  {conversation.last_message_text && (
                    <p className="small mb-0 text-truncate">
                      {conversation.last_message_text}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {meta && meta.last_page > 1 && (
        <div className="card-footer d-flex justify-content-between align-items-center">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={meta.current_page <= 1 || loading}
            onClick={() => onPageChange?.(meta.current_page - 1)}
          >
            Previous
          </button>
          <span className="small text-muted">
            Page {meta.current_page} of {meta.last_page}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={meta.current_page >= meta.last_page || loading}
            onClick={() => onPageChange?.(meta.current_page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

