import type {
  CrossPromotionType,
  PaidDurationUnit,
  PaidPlacementType,
} from './types';

export const CROSS_PROMOTION_TYPE_OPTIONS: { value: CrossPromotionType; label: string }[] = [
  { value: 'coupon_exchange', label: 'Coupon exchange' },
  { value: 'poster_placement', label: 'Poster placement' },
  { value: 'social_media_shoutout', label: 'Social media shoutout' },
  { value: 'event_tieup', label: 'Event tie-up' },
  { value: 'lead_exchange', label: 'Lead exchange' },
  { value: 'product_placement', label: 'Product placement' },
];

export const PAID_PLACEMENT_TYPE_OPTIONS: { value: PaidPlacementType; label: string }[] = [
  { value: 'counter_display', label: 'Counter display' },
  { value: 'standee', label: 'Standee' },
  { value: 'table_tent', label: 'Table tent' },
  { value: 'billing_counter', label: 'Billing counter' },
  { value: 'whatsapp_blast', label: 'WhatsApp blast' },
  { value: 'instagram_post', label: 'Instagram post' },
  { value: 'screen_display', label: 'Screen display' },
  { value: 'event_stall', label: 'Event stall' },
];

export const PAID_DURATION_UNIT_OPTIONS: { value: PaidDurationUnit; label: string }[] = [
  { value: 'day', label: 'Day(s)' },
  { value: 'week', label: 'Week(s)' },
  { value: 'month', label: 'Month(s)' },
  { value: 'event', label: 'Per event' },
];

export function crossTypeLabel(type?: string): string {
  return CROSS_PROMOTION_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type ?? '—';
}

export function paidPlacementLabel(type?: string): string {
  return PAID_PLACEMENT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type ?? '—';
}

export function promotionCategoryLabel(category: 'cross' | 'paid'): string {
  return category === 'paid' ? 'Paid Promotion' : 'Cross Marketing';
}

export function paidDurationLabel(unit?: string, value?: number): string {
  if (!unit) return '—';
  const unitLabel = PAID_DURATION_UNIT_OPTIONS.find((o) => o.value === unit)?.label ?? unit;
  if (value != null && unit !== 'event') {
    return `${value} ${unitLabel}`;
  }
  return unitLabel;
}
