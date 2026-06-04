export function formatCollaborationLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getBusinessTypeLabel(type?: string): string {
  switch (type) {
    case 'individual':
      return 'Individual';
    case 'partnership':
      return 'Partnership';
    case 'company':
      return 'Company';
    default:
      return type || 'Not specified';
  }
}

export function getCollaborationInterestLabels(isProvider: boolean, isBuyer: boolean): string[] {
  if (isProvider && isBuyer) {
    return ['Cross promotion', 'Paid promotion', 'Both'];
  }
  if (isProvider) {
    return ['Cross promotion'];
  }
  if (isBuyer) {
    return ['Paid promotion'];
  }
  return ['Not specified'];
}

export const ASSET_TYPE_LABELS: Record<string, string> = {
  logo: 'Business logo',
  brand_image: 'Outlet / workspace photos',
  promotional_material: 'Promotional images',
  outlet_image: 'Outlet images',
  promotional_creative: 'Promotional creatives',
  brochure: 'Brochure',
  menu: 'Menu',
  rate_card: 'Rate card',
};
