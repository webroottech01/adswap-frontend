'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  useConversations,
  useConversationDetail,
  useSendMessage,
  ConversationsSidebar,
  ChatWindow,
  MessageInput,
} from '@/features/messaging';

export default function MessageConversationPage() {
  const params = useParams();
  const idParam = params?.id;
  const conversationId = typeof idParam === 'string' ? Number.parseInt(idParam, 10) : NaN;

  const {
    data: conversations,
    meta,
    loading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = useConversations();

  const {
    data: conversationDetail,
    loading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useConversationDetail(conversationId || 0);

  const {
    send,
    loading: sendLoading,
    error: sendError,
    clearError: clearSendError,
  } = useSendMessage({
    onSuccess: () => {
      refetchMessages();
      refetchConversations();
    },
  });

  useEffect(() => {
    refetchConversations();
  }, [refetchConversations]);

  useEffect(() => {
    if (conversationId) {
      refetchMessages();
    }
  }, [conversationId, refetchMessages]);

  const messages = conversationDetail?.messages ?? [];

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-md-4">
          <ConversationsSidebar
            conversations={conversations}
            meta={meta}
            activeId={conversationId}
            loading={conversationsLoading}
            error={conversationsError}
            onPageChange={(page) => refetchConversations(page)}
          />
        </div>
        <div className="col-md-8 d-flex flex-column">
          <ChatWindow messages={messages} loading={messagesLoading} error={messagesError} />
          <MessageInput
            onSend={(text) => send(conversationId, text)}
            loading={sendLoading}
            error={sendError}
            onClearError={clearSendError}
          />
        </div>
      </div>
    </div>
  );
}

