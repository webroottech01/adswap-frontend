'use client';

import { MessageCircle, Handshake, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/ui/Button';

interface VisitorActionBarProps {
  businessName: string;
  saved: boolean;
  saveLoading?: boolean;
  collaborateLoading?: boolean;
  isOwnBusiness?: boolean;
  isAuthenticated?: boolean;
  onMessage?: () => void;
  onCollaborate: () => void;
  onToggleSave: () => void;
  onLoginRequired?: () => void;
}

export function VisitorActionBar({
  businessName,
  saved,
  saveLoading = false,
  collaborateLoading = false,
  isOwnBusiness = false,
  isAuthenticated = false,
  onMessage,
  onCollaborate,
  onToggleSave,
  onLoginRequired,
}: VisitorActionBarProps) {
  if (isOwnBusiness) {
    return null;
  }

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }
    action();
  };

  return (
    <div
      className="sticky-bottom bg-white border-top shadow-sm py-3 px-3 mb-4 rounded"
      style={{ bottom: 0, zIndex: 1020 }}
    >
      <div className="container-fluid px-0">
        <p className="small text-muted mb-2 d-none d-md-block">
          Connect with {businessName}
        </p>
        <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
          {onMessage && (
            <Button
              variant="secondary"
              outline
              size="sm"
              icon={MessageCircle}
              onClick={() => requireAuth(onMessage)}
              disabled={!isAuthenticated && !onLoginRequired}
            >
              Message
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            icon={Handshake}
            onClick={() => requireAuth(onCollaborate)}
            loading={collaborateLoading}
          >
            Send collaboration request
          </Button>
          <Button
            variant={saved ? 'success' : 'secondary'}
            outline={!saved}
            size="sm"
            icon={saved ? BookmarkCheck : Bookmark}
            onClick={() => requireAuth(onToggleSave)}
            loading={saveLoading}
          >
            {saved ? 'Saved' : 'Save brand'}
          </Button>
        </div>
      </div>
    </div>
  );
}
