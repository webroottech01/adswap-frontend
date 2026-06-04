'use client';

import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import type { PendingFile } from '@/shared/forms/FileDropzone';
import {
  useMessagesContext,
  useConversationDetail,
  useSendMessage,
  ConversationsSidebar,
  ChatWindow,
  MessageInput,
} from '@/features/messaging';
import type { MessageSendPayload } from '@/features/messaging/components/MessageInput';
import { displayConversationTitle } from '@/features/messaging/utils/conversationTitle';

export default function MessageConversationPage() {
  const params = useParams();
  const idParam = params?.id;
  const conversationId = typeof idParam === 'string' ? Number.parseInt(idParam, 10) : NaN;

  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [chatDragOver, setChatDragOver] = useState(false);

  const {
    conversations,
    meta,
    loading: conversationsLoading,
    error: conversationsError,
    myBusinessId,
    refetchConversations,
  } = useMessagesContext();

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
      void refetchMessages();
      void refetchConversations();
    },
  });

  const messages = conversationDetail?.messages ?? [];

  const conversationTitle = useMemo(() => {
    const fromList = conversations?.find((c) => c.id === conversationId);
    if (fromList) {
      return displayConversationTitle(fromList);
    }
    if (conversationDetail?.conversation) {
      return displayConversationTitle(conversationDetail.conversation);
    }
    return null;
  }, [conversations, conversationId, conversationDetail]);

  const appendFiles = useCallback((incoming: File[]) => {
    setPendingFiles((prev) => {
      const next = [...prev];
      incoming.forEach((file) => {
        const entry: PendingFile = { file };
        if (file.type.startsWith('image/')) {
          entry.preview = URL.createObjectURL(file);
        }
        next.push(entry);
      });
      return next;
    });
  }, []);

  const handleSend = (payload: MessageSendPayload) => {
    void send(conversationId, { text: payload.text, files: payload.files });
  };

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
        <div
          className="col-md-8 d-flex flex-column position-relative"
          onDragEnter={() => setChatDragOver(true)}
          onDragLeave={(e) => {
            if (e.currentTarget === e.target) {
              setChatDragOver(false);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => setChatDragOver(false)}
        >
          <ChatWindow
            messages={messages}
            loading={messagesLoading}
            error={messagesError}
            currentBusinessId={myBusinessId}
            conversationTitle={conversationTitle}
            onFilesDropped={appendFiles}
            isDragOver={chatDragOver}
          />
          <MessageInput
            pendingFiles={pendingFiles}
            onPendingFilesChange={setPendingFiles}
            onSend={handleSend}
            loading={sendLoading}
            error={sendError}
            onClearError={clearSendError}
          />
        </div>
      </div>
    </div>
  );
}
