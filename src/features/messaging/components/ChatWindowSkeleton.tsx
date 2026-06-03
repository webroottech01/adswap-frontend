'use client';

import { Skeleton } from '@/ui/Skeleton';

/** Inline message-area skeleton (used inside ChatWindow card body). */
export function ChatMessagesSkeleton() {
  return (
    <>
      <div className="d-flex justify-content-center my-3">
        <Skeleton style={{ height: 12, width: '50%' }} />
      </div>
      <div className="d-flex justify-content-start mb-3">
        <Skeleton className="rounded" style={{ height: 48, width: '55%' }} />
      </div>
      <div className="d-flex justify-content-end mb-3">
        <Skeleton className="rounded" style={{ height: 40, width: '45%' }} />
      </div>
      <div className="d-flex justify-content-start mb-3">
        <Skeleton className="rounded" style={{ height: 56, width: '60%' }} />
      </div>
      <div className="d-flex justify-content-end mb-0">
        <Skeleton className="rounded" style={{ height: 36, width: '35%' }} />
      </div>
    </>
  );
}

/** Full chat panel skeleton for empty right column on /messages index. */
export function ChatWindowSkeleton() {
  return (
    <div className="card h-100 d-flex flex-column">
      <div className="card-header">
        <Skeleton style={{ height: 20, width: '40%' }} />
      </div>
      <div className="card-body flex-grow-1" style={{ maxHeight: 400 }}>
        <ChatMessagesSkeleton />
      </div>
    </div>
  );
}
