export interface Conversation {
  id: number;
  collaboration_id: number;
  business_one_id: number;
  business_two_id: number;
  created_at: string;
  updated_at: string;
  conversation_title?: string | null;
}

export interface ConversationListItem extends Conversation {
  last_message_text?: string | null;
  last_message_sender_business_id?: number | null;
  partner_business_name?: string | null;
}

export interface ConversationsMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ConversationsResponse {
  data: ConversationListItem[];
  meta: ConversationsMeta;
}

export type MessageType = 'user' | 'system';

export interface MessageAttachment {
  file_url: string;
  file_name: string;
  mime_type: string;
  file_size: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  type: MessageType;
  sender_business_id?: number | null;
  message_text: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  attachment?: MessageAttachment | null;
}

export interface SendMessagePayload {
  text?: string;
  files?: File[];
}

export interface ConversationDetailResponse {
  conversation: Conversation;
  messages: Message[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

