import { z } from 'zod';

export type BusinessType = 'individual' | 'proprietorship' | 'partnership' | 'llp' | 'company';
export type PromotionIntent = 'cross' | 'paid' | 'both' | 'none';
export type DocumentType = 'gst' | 'shop_act' | 'pan' | 'udyam' | 'other';

export interface CompletionSection {
  key: string;
  label: string;
  weight: number;
  filled: number;
  missing_fields: string[];
}

export interface BusinessFormData {
  name: string;
  category: string;
  categoryId?: number;
  city?: string;
  area?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  location?: string;

  businessType: BusinessType;
  registrationNumber?: string;
  foundedYear?: number;
  description?: string;

  providesAdServices: boolean;
  isBuyer: boolean;
  promotionIntent?: PromotionIntent;
  supportedCategoryIds?: number[];
  collaborationPreferences?: Record<string, unknown>;

  scale?: 'micro' | 'small' | 'medium' | 'large';
  employeeCount?: number;
  annualRevenueRange?: string;
  targetAudience?: string[];
  industryExperienceYears?: number;
  keyProductsServices?: string[];
  geographicReach?: string[];
  socialMediaHandles?: Record<string, string>;
  additionalInfo?: string;

  preferredCollaborationTypes?: string[];
  preferredPartnerCategoryIds?: number[];
  preferredLocationRadius?: string;
  budgetRange?: string;
  collaborationNotes?: string;

  logoFile?: File;
  brandAssets?: File[];
  brandAssetTypes?: string[];

  businessDocuments?: File[];
  documentType?: DocumentType;
}

export const TOTAL_STEPS = 8;
export const STEP_NAMES = [
  'Basic Account Info',
  'Business Identity',
  'Promotion Intent',
  'Business Profile',
  'Collaboration Preferences',
  'Brand Assets',
  'Business Verification',
  'Preview & Submit',
] as const;

export const OPTIONAL_STEPS = [4, 5, 6, 7];

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export const step1Schema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  categoryId: z.number().optional(),
  city: z.string().min(1, 'City is required'),
  area: z.string().min(1, 'Area / locality is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Mobile number is required'),
});

export const step2Schema = z.object({
  businessType: z.enum(['individual', 'proprietorship', 'partnership', 'llp', 'company']),
  foundedYear: z.number({ error: 'Founded year is required' }).int().min(1800).max(new Date().getFullYear()),
  description: z
    .string()
    .optional()
    .refine((v) => !v || !v.trim() || (wordCount(v) >= 50 && wordCount(v) <= 300), {
      message: 'Description must be between 50 and 300 words when provided',
    }),
  registrationNumber: z.string().optional(),
});

export const step3Schema = z.object({
  providesAdServices: z.boolean(),
  isBuyer: z.boolean(),
  promotionIntent: z.enum(['cross', 'paid', 'both', 'none']).optional(),
  supportedCategoryIds: z.array(z.number()).optional(),
}).refine((d) => d.providesAdServices || d.isBuyer, {
  message: 'Select at least one role (provider or buyer)',
  path: ['providesAdServices'],
}).refine((d) => !d.providesAdServices || (d.supportedCategoryIds && d.supportedCategoryIds.length > 0), {
  message: 'Select at least one supported category',
  path: ['supportedCategoryIds'],
});

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

export const step5Schema = z.object({
  preferredCollaborationTypes: z.array(z.string()).optional(),
  preferredPartnerCategoryIds: z.array(z.number()).optional(),
  preferredLocationRadius: z.string().optional(),
  budgetRange: z.string().optional(),
  collaborationNotes: z.string().optional(),
});

export const step6Schema = z.object({
  logoFile: z.instanceof(File).optional(),
});

export const step7Schema = z.object({
  businessDocuments: z.array(z.instanceof(File)).optional(),
  documentType: z.enum(['gst', 'shop_act', 'pan', 'udyam', 'other']).optional(),
});

export const businessFormSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(1),
  categoryId: z.number().optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  contactPerson: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  businessType: z.enum(['individual', 'proprietorship', 'partnership', 'llp', 'company']),
  registrationNumber: z.string().optional(),
  foundedYear: z.number().optional(),
  description: z.string().optional(),
  providesAdServices: z.boolean(),
  isBuyer: z.boolean(),
  promotionIntent: z.enum(['cross', 'paid', 'both', 'none']).optional(),
  supportedCategoryIds: z.array(z.number()).optional(),
  collaborationPreferences: z.record(z.string(), z.unknown()).optional(),
  scale: z.enum(['micro', 'small', 'medium', 'large']).optional(),
  employeeCount: z.number().optional(),
  annualRevenueRange: z.string().optional(),
  targetAudience: z.array(z.string()).optional(),
  industryExperienceYears: z.number().optional(),
  keyProductsServices: z.array(z.string()).optional(),
  geographicReach: z.array(z.string()).optional(),
  socialMediaHandles: z.record(z.string(), z.string()).optional(),
  additionalInfo: z.string().optional(),
  preferredCollaborationTypes: z.array(z.string()).optional(),
  preferredPartnerCategoryIds: z.array(z.number()).optional(),
  preferredLocationRadius: z.string().optional(),
  budgetRange: z.string().optional(),
  collaborationNotes: z.string().optional(),
  logoFile: z.instanceof(File).optional(),
  brandAssets: z.array(z.instanceof(File)).optional(),
  businessDocuments: z.array(z.instanceof(File)).optional(),
  documentType: z.enum(['gst', 'shop_act', 'pan', 'udyam', 'other']).optional(),
});

export const STEP_FIELD_MAP: Record<number, (keyof BusinessFormData)[]> = {
  1: ['name', 'category', 'categoryId', 'city', 'area', 'contactPerson', 'email', 'phone'],
  2: ['businessType', 'foundedYear', 'description'],
  3: ['providesAdServices', 'isBuyer', 'promotionIntent', 'supportedCategoryIds'],
  4: ['scale', 'employeeCount', 'annualRevenueRange', 'targetAudience'],
  5: ['preferredCollaborationTypes', 'budgetRange'],
  6: ['logoFile'],
  7: ['businessDocuments', 'documentType'],
  8: [],
};
