'use client';

import { Skeleton } from '@/ui/Skeleton';

const ROW_COUNT = 6;

export function ConversationsSidebarSkeleton() {
  return (
    <ul className="list-group list-group-flush">
      {Array.from({ length: ROW_COUNT }).map((_, index) => (
        <li key={index} className="list-group-item">
          <div className="d-flex gap-3 align-items-start">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between mb-2">
                <Skeleton style={{ height: 14, width: '55%' }} />
                <Skeleton style={{ height: 12, width: 48 }} />
              </div>
              <Skeleton style={{ height: 12, width: '80%' }} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
