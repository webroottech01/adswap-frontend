export interface ConversationTitleSource {
  id: number;
  conversation_title?: string | null;
  partner_business_name?: string | null;
}

export function displayConversationTitle(item: ConversationTitleSource): string {
  if (item.conversation_title?.trim()) {
    return item.conversation_title.trim();
  }
  if (item.partner_business_name?.trim()) {
    return item.partner_business_name.trim();
  }
  return `Conversation #${item.id}`;
}
