'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useConversations,
  ConversationsSidebar,
  ChatWindow,
} from '@/features/messaging';

export default function Messages() {
  const router = useRouter();
  const {
    data: conversations,
    meta,
    loading,
    error,
    refetch,
  } = useConversations();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!loading && Array.isArray(conversations) && conversations.length > 0) {
      router.replace(`/messages/${conversations[0].id}`);
    }
  }, [loading, conversations, router]);

  const hasConversations = Array.isArray(conversations) && conversations.length > 0;

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-md-4">
          <ConversationsSidebar
            conversations={conversations}
            meta={meta}
            activeId={undefined}
            loading={loading}
            error={error}
            onPageChange={(page) => refetch(page)}
          />
        </div>
        <div className="col-md-8 d-flex flex-column">
          {loading && !hasConversations ? (
            <div className="card h-100 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading…</span>
                </div>
                <p className="text-muted mb-0">Loading conversations…</p>
              </div>
            </div>
          ) : hasConversations ? (
            <ChatWindow messages={[]} loading={false} error={null} />
          ) : (
            <div className="card h-100 d-flex align-items-center justify-content-center">
              <div className="text-center px-4">
                <h2 className="h5 mb-2">No conversations yet</h2>
                <p className="text-muted mb-0">
                  Once a collaboration is accepted, a conversation will appear here. Select a
                  conversation from the list on the left to start messaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

