import { useState, useEffect, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BusinessFormData,
  businessFormSchema,
  step2Schema,
  TOTAL_STEPS,
  STEP_FIELD_MAP,
  OPTIONAL_STEPS,
} from '../types';
import { businessApi, Business } from '../api';
import { transformFormToUpdateData, transformBusinessToFormData } from '../utils/formTransformers';

const STORAGE_KEY = 'business_form_data';

export const useBusinessForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachableStep, setMaxReachableStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [existingBusiness, setExistingBusiness] = useState<Business | null>(null);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [completionSections, setCompletionSections] = useState<Business['completion_sections']>([]);
  const [uploadRevision, setUploadRevision] = useState(0);

  const form: UseFormReturn<BusinessFormData> = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: '',
      category: '',
      city: '',
      area: '',
      contactPerson: '',
      email: '',
      phone: '',
      businessType: 'individual',
      providesAdServices: false,
      isBuyer: true,
      promotionIntent: 'none',
      supportedCategoryIds: [],
      targetAudience: [],
      keyProductsServices: [],
      geographicReach: [],
      preferredCollaborationTypes: [],
      preferredPartnerCategoryIds: [],
    },
    mode: 'onChange',
  });

  const applyBusinessToForm = useCallback(
    (business: Business) => {
      setExistingBusiness(business);
      setCompletionPercentage(business.profile_completion_percentage ?? 0);
      setCompletionSections(business.completion_sections ?? []);
      const step = Math.max(1, Math.min(TOTAL_STEPS, business.onboarding_step ?? 1));
      setCurrentStep(step);
      setMaxReachableStep(Math.max(step, business.onboarding_completed_at ? TOTAL_STEPS : step));

      const formData = transformBusinessToFormData(business);
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof BusinessFormData, value as never);
        }
      });
    },
    [form]
  );

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData && !existingBusiness) {
      try {
        const parsed = JSON.parse(savedData);
        Object.keys(parsed).forEach((key) => {
          if (!['logoFile', 'brandAssets', 'businessDocuments'].includes(key)) {
            form.setValue(key as keyof BusinessFormData, parsed[key]);
          }
        });
      } catch {
        /* ignore */
      }
    }
  }, [form, existingBusiness]);

  useEffect(() => {
    loadExistingBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = form.watch((data) => {
      const dataToSave = { ...data };
      delete dataToSave.logoFile;
      delete dataToSave.brandAssets;
      delete dataToSave.businessDocuments;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const uploadPendingFiles = async (business: Business | null): Promise<Business | null> => {
    if (!business) return null;

    const values = form.getValues();
    let current = business;
    let didUpload = false;

    if (values.logoFile) {
      current = await businessApi.uploadLogo(values.logoFile);
      form.setValue('logoFile', undefined);
      didUpload = true;
    }

    if (values.brandAssets && values.brandAssets.length > 0) {
      current = await businessApi.uploadAssets(values.brandAssets, 'outlet_image');
      form.setValue('brandAssets', []);
      didUpload = true;
    }

    if (values.businessDocuments && values.businessDocuments.length > 0 && values.documentType) {
      current = await businessApi.uploadDocument(values.businessDocuments[0], values.documentType);
      form.setValue('businessDocuments', []);
      didUpload = true;
    }

    if (didUpload) {
      setUploadRevision((v) => v + 1);
    }

    return current;
  };

  const persistDraft = async (step: number) => {
    const formData = form.getValues();
    const payload = transformFormToUpdateData(formData, step);

    let business: Business | null = existingBusiness;

    if (business) {
      business = await businessApi.saveDraft(payload);
    } else if (formData.name?.length >= 2) {
      business = await businessApi.createDraft(formData.name, step);
      business = await businessApi.saveDraft(transformFormToUpdateData(formData, step));
    }

    if (business) {
      business = await uploadPendingFiles(business);
      if (business) {
        applyBusinessToForm(business);
        setExistingBusiness(business);
      }
    }

    return business;
  };

  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 2) {
      const values = form.getValues();
      const result = step2Schema.safeParse({
        businessType: values.businessType,
        foundedYear: values.foundedYear,
        description: values.description ?? '',
        registrationNumber: values.registrationNumber,
      });
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof BusinessFormData;
          if (field) {
            form.setError(field, { message: issue.message });
          }
        });
        return false;
      }
      return true;
    }
    const fields = STEP_FIELD_MAP[step];
    if (!fields?.length) return true;
    return form.trigger(fields as (keyof BusinessFormData)[]);
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    const next = Math.min(currentStep + 1, TOTAL_STEPS);
    setIsSavingDraft(true);
    try {
      await persistDraft(next);
      setCurrentStep(next);
      setMaxReachableStep((prev) => Math.max(prev, next));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setSubmitError(err.response?.data?.message || 'Failed to save progress');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const skipStep = async () => {
    if (!OPTIONAL_STEPS.includes(currentStep)) return;
    const next = Math.min(currentStep + 1, TOTAL_STEPS);
    setIsSavingDraft(true);
    try {
      await persistDraft(next);
      setCurrentStep(next);
      setMaxReachableStep((prev) => Math.max(prev, next));
    } finally {
      setIsSavingDraft(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS && step <= maxReachableStep) {
      setCurrentStep(step);
    }
  };

  const loadExistingBusiness = async () => {
    setIsLoadingBusiness(true);
    setSubmitError(null);
    try {
      const business = await businessApi.getMyBusiness();
      applyBusinessToForm(business);
      return business;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err.response?.status !== 404) {
        setSubmitError(err.response?.data?.message || 'Failed to load business data');
      }
      return null;
    } finally {
      setIsLoadingBusiness(false);
    }
  };

  const saveDraft = async () => {
    setIsSavingDraft(true);
    setSubmitError(null);
    try {
      await persistDraft(currentStep);
      return { success: true };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      let errorMessage = 'Failed to save draft.';
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      else if (err.response?.data?.errors) {
        const first = Object.values(err.response.data.errors)[0];
        errorMessage = Array.isArray(first) ? first[0] : String(first);
      }
      setSubmitError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSavingDraft(false);
    }
  };

  const submitForm = async (forReview = true) => {
    const isValid = await form.trigger();
    if (!isValid) {
      setSubmitError('Please fix the errors in the form before submitting.');
      return { success: false, error: 'Validation failed' };
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = form.getValues();
      const payload = transformFormToUpdateData(formData, TOTAL_STEPS);

      let business: Business | null = existingBusiness;
      if (business) {
        business = await uploadPendingFiles(business);
        const payloadAfterUpload = transformFormToUpdateData(form.getValues(), TOTAL_STEPS);
        business = forReview
          ? await businessApi.submitForReview(payloadAfterUpload)
          : await businessApi.updateBusiness(payloadAfterUpload);
      } else {
        business = await businessApi.createBusiness({
          ...payload,
          name: formData.name,
          submit_for_review: forReview,
        } as import('../api').CreateBusinessData);
        business = await uploadPendingFiles(business);
      }

      applyBusinessToForm(business!);
      if (forReview) {
        localStorage.removeItem(STORAGE_KEY);
      }

      return { success: true, business };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      let errorMessage = 'Failed to save business. Please try again.';
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      else if (err.response?.data?.errors) {
        const first = Object.values(err.response.data.errors)[0];
        errorMessage = Array.isArray(first) ? first[0] : String(first);
      }
      setSubmitError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgress = () => completionPercentage || Math.round((currentStep / TOTAL_STEPS) * 100);

  return {
    form,
    currentStep,
    totalSteps: TOTAL_STEPS,
    maxReachableStep,
    nextStep,
    prevStep,
    goToStep,
    skipStep,
    saveDraft,
    submitForm,
    getProgress,
    completionPercentage,
    completionSections,
    isSubmitting,
    isSavingDraft,
    submitError,
    existingBusiness,
    isLoadingBusiness,
    loadExistingBusiness,
    uploadRevision,
  };
};
