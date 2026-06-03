'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useMessagesContext,
  ConversationsSidebar,
  ChatWindow,
} from '@/features/messaging';
import { ChatWindowSkeleton } from '@/features/messaging/components/ChatWindowSkeleton';

export default function Messages() {
  const router = useRouter();
  const {
    conversations,
    meta,
    loading,
    error,
    refetchConversations,
  } = useMessagesContext();

  const hasConversations = Array.isArray(conversations) && conversations.length > 0;

  useEffect(() => {
    if (!loading && hasConversations) {
      router.replace(`/messages/${conversations[0].id}`);
    }
  }, [loading, hasConversations, conversations, router]);

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
            onPageChange={(page) => refetchConversations(page)}
          />
        </div>
        <div className="col-md-8 d-flex flex-column">
          {loading && !hasConversations ? (
            <ChatWindowSkeleton />
          ) : hasConversations ? (
            <ChatWindow messages={[]} loading={false} error={null} />
          ) : (
            <div className="card h-100 d-flex align-items-center justify-content-center">
              <div className="text-center px-4">
                <h2 className="h5 mb-2">No conversations yet</h2>
                <p className="text-muted mb-0">
                  Conversations open when you send a collaboration request. Select one from the
                  list on the left to start messaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
