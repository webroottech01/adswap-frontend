import { BusinessFormData, PromotionIntent } from '../types';
import { CreateBusinessData, UpdateBusinessData, Business } from '../api';

function derivePromotionIntent(formData: BusinessFormData): PromotionIntent {
  if (formData.promotionIntent) return formData.promotionIntent;
  if (!formData.providesAdServices) return 'none';
  return 'cross';
}

export function transformFormToCreateData(formData: BusinessFormData): CreateBusinessData {
  const result: CreateBusinessData = {
    name: formData.name,
    category: formData.category,
    category_id: formData.categoryId,
    address: [formData.area, formData.city].filter(Boolean).join(', ') || formData.location,
    city: formData.city,
    area: formData.area,
    contact_person: formData.contactPerson,
    phone: formData.phone,
    email: formData.email,
    business_type: formData.businessType,
    registration_number: formData.registrationNumber || undefined,
    founded_year: formData.foundedYear,
    description: formData.description || undefined,
    is_provider: Boolean(formData.providesAdServices),
    is_buyer: Boolean(formData.isBuyer ?? true),
    promotion_intent: derivePromotionIntent(formData),
    supported_category_ids:
      formData.supportedCategoryIds && formData.supportedCategoryIds.length > 0
        ? formData.supportedCategoryIds
        : undefined,
    preferred_collaboration_types: formData.preferredCollaborationTypes?.length
      ? formData.preferredCollaborationTypes
      : undefined,
    preferred_partner_category_ids: formData.preferredPartnerCategoryIds?.length
      ? formData.preferredPartnerCategoryIds
      : undefined,
    preferred_location_radius: formData.preferredLocationRadius || undefined,
    budget_range: formData.budgetRange || undefined,
    collaboration_notes: formData.collaborationNotes || undefined,
    employee_count: formData.employeeCount || undefined,
    annual_revenue_range: formData.annualRevenueRange || undefined,
    target_audience: formData.targetAudience?.length ? formData.targetAudience : undefined,
  };

  if (
    formData.scale ||
    formData.industryExperienceYears ||
    formData.keyProductsServices?.length ||
    formData.geographicReach?.length ||
    formData.socialMediaHandles ||
    formData.additionalInfo
  ) {
    result.profile = {
      scale: formData.scale,
      industry_experience_years: formData.industryExperienceYears,
      key_products_services: formData.keyProductsServices?.length ? formData.keyProductsServices : undefined,
      geographic_reach: formData.geographicReach?.length ? formData.geographicReach : undefined,
      social_media_handles: formData.socialMediaHandles,
      additional_info: formData.additionalInfo || undefined,
    };
  }

  return result;
}

export function transformFormToUpdateData(
  formData: BusinessFormData,
  onboardingStep?: number
): UpdateBusinessData {
  return {
    ...transformFormToCreateData(formData),
    onboarding_step: onboardingStep,
  };
}

export function transformBusinessToFormData(business: Business): Partial<BusinessFormData> {
  const prefs = business.collaboration_preferences ?? {};

  return {
    name: business.name,
    category: business.category,
    categoryId: business.category_id ?? undefined,
    city: business.city ?? undefined,
    area: business.area ?? undefined,
    contactPerson: business.contact_person ?? undefined,
    email: business.email ?? undefined,
    phone: business.phone ?? undefined,
    location: business.address ?? undefined,
    businessType: (business.business_type as BusinessFormData['businessType']) || 'individual',
    registrationNumber: business.registration_number ?? undefined,
    foundedYear: business.founded_year ?? undefined,
    description: business.description ?? undefined,
    providesAdServices: business.is_provider,
    isBuyer: business.is_buyer,
    promotionIntent: business.promotion_intent ?? (business.is_provider ? 'cross' : 'none'),
    supportedCategoryIds: business.supported_category_ids ?? [],
    preferredCollaborationTypes: prefs.preferred_collaboration_types ?? [],
    preferredPartnerCategoryIds: business.preferred_partner_category_ids ?? [],
    preferredLocationRadius: business.preferred_location_radius ?? undefined,
    budgetRange: prefs.budget_range ?? undefined,
    collaborationNotes: prefs.collaboration_notes ?? undefined,
    scale: business.profile?.scale as BusinessFormData['scale'],
    employeeCount: business.employee_count ?? undefined,
    annualRevenueRange: business.annual_revenue_range ?? undefined,
    targetAudience: business.target_audience ?? [],
    industryExperienceYears: business.profile?.industry_experience_years ?? undefined,
    keyProductsServices: business.profile?.key_products_services ?? [],
    geographicReach: business.profile?.geographic_reach ?? [],
    socialMediaHandles: business.profile?.social_media_handles ?? undefined,
    additionalInfo: business.profile?.additional_info ?? undefined,
  };
}
