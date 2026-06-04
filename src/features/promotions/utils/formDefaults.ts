import type {
  CrossPromotionDetails,
  PaidPromotionDetails,
  Promotion,
  PromotionCategory,
} from '../types';

export function defaultCrossDetails(): CrossPromotionDetails {
  return {
    promotion_type: 'coupon_exchange',
    what_i_can_offer: '',
    what_i_expect_in_return: '',
    target_partner_category_ids: [],
    target_partner_category: '',
    target_location: '',
    available_duration: {},
    terms_and_conditions: '',
  };
}

export function defaultPaidDetails(): PaidPromotionDetails {
  return {
    placement_type: 'counter_display',
    price: { is_custom_quote: false, amount: undefined },
    duration: { unit: 'week', value: 1 },
    available_slots: '',
    expected_reach: '',
    approval_required: false,
    refund_cancellation_terms: '',
  };
}

export function defaultDetailsForCategory(category: PromotionCategory) {
  return category === 'paid' ? defaultPaidDetails() : defaultCrossDetails();
}

export function detailsFromPromotion(promotion: Promotion | null | undefined) {
  if (!promotion) {
    return defaultCrossDetails();
  }
  const base = defaultDetailsForCategory(promotion.category);
  return { ...base, ...promotion.details };
}
