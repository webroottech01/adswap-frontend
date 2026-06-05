export function formatConversationLabel(
  businessName?: string | null,
  promotionTitle?: string | null,
  fallbackId?: number,
): string {
  const business =
    businessName?.trim() || (fallbackId != null ? `Conversation #${fallbackId}` : 'Messages');
  const promo = promotionTitle?.trim();
  return promo ? `${business} - ${promo}` : business;
}
