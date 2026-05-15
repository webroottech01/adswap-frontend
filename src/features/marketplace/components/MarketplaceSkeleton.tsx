'use client';

import { Skeleton } from '@/ui/Skeleton';
import { Card } from '@/ui/Card';

/**
 * Marketplace Skeleton Component
 * Loading state placeholder for marketplace cards
 */
export function MarketplaceSkeleton() {
  return (
    <Card className="h-100">
      <div className="card-body">
        <div className="d-flex align-items-start mb-3">
          <Skeleton className="rounded" style={{ width: 64, height: 64 }} />
          <div className="ms-3 flex-grow-1">
            <Skeleton style={{ height: 24, width: '70%', marginBottom: 8 }} />
            <Skeleton style={{ height: 20, width: '40%' }} />
          </div>
        </div>
        <Skeleton style={{ height: 60, marginBottom: 16 }} />
        <Skeleton style={{ height: 16, width: '60%', marginBottom: 8 }} />
        <Skeleton style={{ height: 16, width: '50%' }} />
      </div>
    </Card>
  );
}




