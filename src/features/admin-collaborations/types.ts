export type AdminCollaborationStatus = 'pending' | 'accepted' | 'rejected';

export interface AdminCollaboration {
  id: number;
  sender_business_id: number;
  receiver_business_id: number;
  status: AdminCollaborationStatus;
  message: string;
  created_at: string;
  updated_at: string;
  sender_business_name?: string | null;
  receiver_business_name?: string | null;
}

export interface AdminCollaborationListResponse {
  data: AdminCollaboration[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

