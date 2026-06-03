import { BusinessFormData } from '../types';
import { CreateBusinessData, UpdateBusinessData, Business } from '../api';
import { Service } from '@/features/serviceCatalog/api';

/**
 * Map service type strings to service IDs
 * Maps frontend service slugs (like 'hoardings', 'coupons') to backend service IDs
 */
export function mapServiceSlugsToIds(serviceSlugs: string[] = [], services: Service[]): number[] {
  const serviceIds: number[] = [];

  serviceSlugs.forEach((slug) => {
    const service = services.find((s) => s.slug === slug);
    if (service) {
      serviceIds.push(service.id);
    }
  });

  return serviceIds;
}

/**
 * Map service IDs back to service type strings
 * Used when loading existing business data into the form
 */
export function mapServiceIdsToSlugs(serviceIds: number[], services: Service[]): string[] {
  const slugs: string[] = [];

  serviceIds.forEach((id) => {
    const service = services.find((s) => s.id === id);
    if (service) {
      slugs.push(service.slug);
    }
  });

  return slugs;
}

/**
 * Transform frontend form data to backend CreateBusinessData format
 */
export function transformFormToCreateData(
  formData: BusinessFormData,
  services: Service[] = []
): CreateBusinessData {
  // Map service types to IDs
  const serviceIds = mapServiceSlugsToIds(formData.serviceSlugs || [], services);

  const result: CreateBusinessData = {
    // Step 1: Basic Account Info (required)
    name: formData.name,
    category: formData.category,
    address: formData.location || undefined,
    // Step 2: Business Identity (required)
    business_type: formData.businessType,
    registration_number: formData.registrationNumber || undefined,
    founded_year: formData.foundedYear || undefined,
    description: formData.description || undefined,
    // Step 3: Collaboration Preference (required)
    is_provider: Boolean(formData.providesAdServices),
    is_buyer: Boolean(formData.isBuyer ?? true), // Default to true if not set
    collaboration_preferences: formData.collaborationPreferences || undefined,
    service_ids: serviceIds.length > 0 ? serviceIds : undefined,
    // Step 5: Collaboration Preferences (stored in collaboration_preferences)
    preferred_collaboration_types: formData.preferredCollaborationTypes && formData.preferredCollaborationTypes.length > 0 ? formData.preferredCollaborationTypes : undefined,
    budget_range: formData.budgetRange || undefined,
    collaboration_notes: formData.collaborationNotes || undefined,
    // Step 4: Business Profile (optional)
    employee_count: formData.employeeCount || undefined,
    annual_revenue_range: formData.annualRevenueRange || undefined,
    target_audience: formData.targetAudience && formData.targetAudience.length > 0 ? formData.targetAudience : undefined,
  };

  // Add profile data if any profile fields are provided
  if (formData.scale || formData.industryExperienceYears || formData.keyProductsServices?.length || 
      formData.geographicReach?.length || formData.socialMediaHandles || formData.additionalInfo) {
    result.profile = {
      scale: formData.scale || undefined,
      industry_experience_years: formData.industryExperienceYears || undefined,
      key_products_services: formData.keyProductsServices && formData.keyProductsServices.length > 0 ? formData.keyProductsServices : undefined,
      geographic_reach: formData.geographicReach && formData.geographicReach.length > 0 ? formData.geographicReach : undefined,
      social_media_handles: formData.socialMediaHandles || undefined,
      additional_info: formData.additionalInfo || undefined,
    };
  }

  // Step 5: Collaboration Preferences
  if (formData.preferredCollaborationTypes?.length || formData.budgetRange || formData.collaborationNotes) {
    result.preferred_collaboration_types = formData.preferredCollaborationTypes && formData.preferredCollaborationTypes.length > 0 ? formData.preferredCollaborationTypes : undefined;
    result.budget_range = formData.budgetRange || undefined;
    result.collaboration_notes = formData.collaborationNotes || undefined;
  }

  // Step 6: Brand Proof (assets) - Note: File uploads will be handled separately via FormData
  // Assets will be processed on the frontend and sent as file paths after upload

  // Step 7: Business Documents - Note: File uploads will be handled separately via FormData
  // Documents will be processed on the frontend and sent as file paths after upload

  return result;
}

/**
 * Transform frontend form data to backend UpdateBusinessData format
 */
export function transformFormToUpdateData(
  formData: BusinessFormData,
  services: Service[] = []
): UpdateBusinessData {
  return transformFormToCreateData(formData, services);
}

/**
 * Transform backend Business data to frontend form data format
 */
export function transformBusinessToFormData(
  business: Business,
  services: Service[] = []
): Partial<BusinessFormData> {
  const serviceSlugs = mapServiceIdsToSlugs(business.service_ids || [], services);

  return {
    // Step 1
    name: business.name,
    category: business.category,
    location: business.address || undefined,
    // Step 2
    businessType: (business as any).business_type || 'company',
    registrationNumber: (business as any).registration_number || undefined,
    foundedYear: (business as any).founded_year || undefined,
    description: business.description || undefined,
    // Step 3
    providesAdServices: business.is_provider,
    isBuyer: business.is_buyer,
    serviceSlugs: serviceSlugs.length > 0 ? serviceSlugs : undefined,
    collaborationPreferences: (business as any).collaboration_preferences || undefined,
    // Step 4
    scale: (business as any).profile?.scale || undefined,
    employeeCount: (business as any).employee_count || undefined,
    annualRevenueRange: (business as any).annual_revenue_range || undefined,
    targetAudience: (business as any).target_audience || undefined,
    industryExperienceYears: (business as any).profile?.industry_experience_years || undefined,
    keyProductsServices: (business as any).profile?.key_products_services || undefined,
    geographicReach: (business as any).profile?.geographic_reach || undefined,
    socialMediaHandles: (business as any).profile?.social_media_handles || undefined,
    additionalInfo: (business as any).profile?.additional_info || undefined,
  };
}

/**
 * Map location field to address field
 */
export function mapLocationToAddress(location?: string): string | undefined {
  return location || undefined;
}

