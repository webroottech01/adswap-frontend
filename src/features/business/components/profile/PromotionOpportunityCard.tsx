'use client';

import { PromotionContentPreview } from '@/features/promotions/components/PromotionContentPreview';
import type { Promotion } from '@/features/promotions/types';

export function PromotionOpportunityCard({ promotion }: { promotion: Promotion }) {
  return (
    <article className="h-100">
      <PromotionContentPreview promotion={promotion} />
    </article>
  );
}
