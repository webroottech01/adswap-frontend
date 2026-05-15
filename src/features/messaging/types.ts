export interface Conversation {
  id: number;
  collaboration_id: number;
  business_one_id: number;
  business_two_id: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationListItem extends Conversation {
  last_message_text?: string | null;
  last_message_sender_business_id?: number | null;
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

export interface Message {
  id: number;
  conversation_id: number;
  sender_business_id: number;
  message_text: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
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

