/**
 * Collaboration request (API response shape).
 */
export interface CollaborationRequest {
  id: number;
  sender_business_id: number;
  receiver_business_id: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  sender_business_name?: string | null;
  receiver_business_name?: string | null;
  conversation_id?: number | null;
}
