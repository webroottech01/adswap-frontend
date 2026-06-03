import { z } from 'zod';

/**
 * Business Type Enum
 */
export type BusinessType = 'individual' | 'partnership' | 'company';

/**
 * Business Form Data Interface
 */
export interface BusinessFormData {
  // Step 1: Basic Account Info (required)
  name: string;
  category: string;
  location?: string;

  // Step 2: Business Identity (required)
  businessType: BusinessType;
  registrationNumber?: string;
  foundedYear?: number;
  description?: string;

  // Step 3: Collaboration Preference (required)
  providesAdServices: boolean;
  isBuyer: boolean;
  serviceSlugs?: string[];
  collaborationPreferences?: Record<string, unknown>;

  // Step 4: Business Profile Info + Scale + Audience (optional)
  scale?: 'micro' | 'small' | 'medium' | 'large';
  employeeCount?: number;
  annualRevenueRange?: string;
  targetAudience?: string[];
  industryExperienceYears?: number;
  keyProductsServices?: string[];
  geographicReach?: string[];
  socialMediaHandles?: Record<string, string>;
  additionalInfo?: string;

  // Step 5: Collaboration Preferences (optional)
  preferredCollaborationTypes?: string[];
  budgetRange?: string;
  collaborationNotes?: string;

  // Step 6: Brand Proof (optional)
  brandProofs?: File[];

  // Step 7: Business Documents (optional, only one of GST/Shop Act/PAN)
  businessDocuments?: File[];
  documentType?: 'gst' | 'shop_act' | 'pan' | 'other';
}

/**
 * Step Numbers
 */
export const TOTAL_STEPS = 8;
export const STEP_NAMES = [
  'Basic Account Info',
  'Business Identity',
  'Collaboration Preference',
  'Business Profile',
  'Collaboration Preferences',
  'Brand Proof',
  'Business Documents',
  'Preview',
] as const;

/**
 * Zod Validation Schemas
 */

// Step 1: Basic Account Info (required)
export const step1Schema = z.object({
  name: z.string().min(1, 'Business name is required').min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().optional(),
});

// Step 2: Business Identity (required)
export const step2Schema = z.object({
  businessType: z.enum(['individual', 'partnership', 'company'], {
    message: 'Business type is required',
  }),
  registrationNumber: z.string().optional(),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  description: z.string().optional(),
});

// Step 3: Collaboration Preference (required)
export const step3Schema = z.object({
  providesAdServices: z.boolean(),
  isBuyer: z.boolean(),
  serviceSlugs: z.array(z.string()).optional(),
  collaborationPreferences: z.record(z.string(), z.unknown()).optional(),
});

// Step 4: Business Profile Info + Scale + Audience (optional)
export const step4Schema = z.object({
  scale: z.enum(['micro', 'small', 'medium', 'large']).optional(),
  employeeCount: z.number().int().min(0).optional(),
  annualRevenueRange: z.string().optional(),
  targetAudience: z.array(z.string()).optional(),
  industryExperienceYears: z.number().int().min(0).max(100).optional(),
  keyProductsServices: z.array(z.string()).optional(),
  geographicReach: z.array(z.string()).optional(),
  socialMediaHandles: z.record(z.string(), z.string()).optional(),
  additionalInfo: z.string().max(2000).optional(),
});

// Step 5: Collaboration Preferences (optional)
export const step5Schema = z.object({
  preferredCollaborationTypes: z.array(z.string()).optional(),
  budgetRange: z.string().optional(),
  collaborationNotes: z.string().optional(),
});

// Step 6: Brand Proof (optional)
export const step6Schema = z.object({
  brandProofs: z.array(z.instanceof(File)).optional(),
});

// Step 7: Business Documents (optional, only one of GST/Shop Act/PAN)
export const step7Schema = z.object({
  businessDocuments: z.array(z.instanceof(File)).optional(),
  documentType: z.enum(['gst', 'shop_act', 'pan', 'other']).optional(),
}).refine(
  (data) => {
    // If documents are provided, documentType must be set
    if (data.businessDocuments && data.businessDocuments.length > 0) {
      return !!data.documentType;
    }
    return true;
  },
  {
    message: 'Document type is required when uploading documents',
    path: ['documentType'],
  }
).refine(
  (data) => {
    // Only one of GST/Shop Act/PAN can be selected
    if (data.documentType && ['gst', 'shop_act', 'pan'].includes(data.documentType)) {
      return true; // Validation will be handled by backend
    }
    return true;
  }
);

// Step 8: Preview (no validation needed)
export const step8Schema = z.object({});

// Complete form schema
export const businessFormSchema = z.object({
  // Step 1
  name: step1Schema.shape.name,
  category: step1Schema.shape.category,
  location: step1Schema.shape.location,
  // Step 2
  businessType: step2Schema.shape.businessType,
  registrationNumber: step2Schema.shape.registrationNumber,
  foundedYear: step2Schema.shape.foundedYear,
  description: step2Schema.shape.description,
  // Step 3
  providesAdServices: step3Schema.shape.providesAdServices,
  isBuyer: step3Schema.shape.isBuyer,
  serviceSlugs: step3Schema.shape.serviceSlugs,
  collaborationPreferences: step3Schema.shape.collaborationPreferences,
  // Step 4
  scale: step4Schema.shape.scale,
  employeeCount: step4Schema.shape.employeeCount,
  annualRevenueRange: step4Schema.shape.annualRevenueRange,
  targetAudience: step4Schema.shape.targetAudience,
  industryExperienceYears: step4Schema.shape.industryExperienceYears,
  keyProductsServices: step4Schema.shape.keyProductsServices,
  geographicReach: step4Schema.shape.geographicReach,
  socialMediaHandles: step4Schema.shape.socialMediaHandles,
  additionalInfo: step4Schema.shape.additionalInfo,
  // Step 5
  preferredCollaborationTypes: step5Schema.shape.preferredCollaborationTypes,
  budgetRange: step5Schema.shape.budgetRange,
  collaborationNotes: step5Schema.shape.collaborationNotes,
  // Step 6
  brandProofs: step6Schema.shape.brandProofs,
  // Step 7
  businessDocuments: step7Schema.shape.businessDocuments,
  documentType: step7Schema.shape.documentType,
});

