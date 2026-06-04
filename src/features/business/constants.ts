export const TARGET_AUDIENCE_OPTIONS = [
  'Families',
  'Kids',
  'Students',
  'Young Adults',
  'Professionals',
  'Couples',
  'Women',
  'Men',
  'Corporate Clients',
  'Tourists',
  'Premium Audience',
  'Luxury Audience',
];

export const REVENUE_SLABS = ['0-5 Lakhs', '5-20 Lakhs', '20-50 Lakhs', '50 Lakhs+'];

export const COLLABORATION_TYPE_OPTIONS = [
  'Coupon Exchange',
  'Cross Promotion',
  'Paid Promotion',
  'In-Store Branding',
  'Digital Promotion',
  'Event Collaboration',
  'Lead Exchange',
  'Product Placement',
  'Custom Collaboration',
];

export const BUDGET_RANGE_OPTIONS = [
  'No Budget / Barter Only',
  'Under ₹5,000',
  '₹5,000 - ₹10,000',
  '₹10,000 - ₹25,000',
  '₹25,000 - ₹50,000',
  '₹50,000+',
];

export const LOCATION_RADIUS_OPTIONS = [
  'Same locality',
  '5 km',
  '10 km',
  '25 km',
  '50 km',
  'City-wide',
  'State-wide',
  'Pan India',
];

export const BUSINESS_TYPE_OPTIONS = [
  { value: 'individual', label: 'Individual' },
  { value: 'proprietorship', label: 'Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llp', label: 'LLP' },
  { value: 'company', label: 'Company' },
] as const;

export const PROMOTION_INTENT_OPTIONS = [
  { value: 'cross', label: 'Cross Promotion' },
  { value: 'paid', label: 'Paid Promotion' },
  { value: 'both', label: 'Both' },
] as const;

export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'gst', label: 'GST' },
  { value: 'shop_act', label: 'Shop Act' },
  { value: 'pan', label: 'PAN' },
  { value: 'udyam', label: 'Udyam' },
  { value: 'other', label: 'Other' },
] as const;
