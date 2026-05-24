import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BusinessFormData, businessFormSchema, step1Schema, step2Schema, TOTAL_STEPS } from '../types';
import { businessApi, Business } from '../api';
import { transformFormToCreateData, transformFormToUpdateData, transformBusinessToFormData } from '../utils/formTransformers';
import { useServices } from './useServices';

const STORAGE_KEY = 'business_form_data';

/**
 * Hook for managing multi-step business form state
 */
export const useBusinessForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [existingBusiness, setExistingBusiness] = useState<Business | null>(null);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(false);

  const { enabledServices } = useServices();

  // Initialize form with react-hook-form
  const form: UseFormReturn<BusinessFormData> = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: '',
      category: '',
      location: '',
      businessType: 'individual',
      registrationNumber: '',
      foundedYear: undefined,
      description: '',
      providesAdServices: false,
      isBuyer: true,
      paidPromotion: false,
      paidPromotionTypes: [],
      crossMarketing: false,
      crossMarketingTypes: [],
      collaborationPreferences: undefined,
      scale: undefined,
      employeeCount: undefined,
      annualRevenueRange: undefined,
      targetAudience: [],
      industryExperienceYears: undefined,
      keyProductsServices: [],
      geographicReach: [],
      socialMediaHandles: undefined,
      additionalInfo: '',
      preferredCollaborationTypes: [],
      budgetRange: undefined,
      collaborationNotes: '',
      brandProofs: [],
      businessDocuments: [],
      documentType: undefined,
    },
    mode: 'onChange',
  });

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Restore form values (excluding File objects which can't be serialized)
        Object.keys(parsed).forEach((key) => {
          if (key !== 'brandProofs' && key !== 'businessDocuments') {
            form.setValue(key as keyof BusinessFormData, parsed[key]);
          }
        });
      } catch (error) {
        console.error('Failed to load saved form data:', error);
      }
    }
  }, [form]);

  // Auto-load existing business on mount
  useEffect(() => {
    loadExistingBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  // Save form data to localStorage on change
  useEffect(() => {
    const subscription = form.watch((data) => {
      // Only save non-File fields to localStorage
      const dataToSave = { ...data };
      delete dataToSave.brandProofs;
      delete dataToSave.businessDocuments;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  /**
   * Validate current step and move to next
   */
  const nextStep = async () => {
    let isValid = false;

    // Validate based on current step
    if (currentStep === 1) {
      // Step 1: Basic Account Info (required)
      isValid = await form.trigger(['name', 'category']);
    } else if (currentStep === 2) {
      // Step 2: Business Identity (required)
      isValid = await form.trigger(['businessType']);
    } else if (currentStep === 3) {
      // Step 3: Collaboration Preference (required)
      isValid = await form.trigger(['providesAdServices', 'isBuyer']);
    } else {
      // Steps 4-7 are optional, always valid
      isValid = true;
    }

    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  /**
   * Move to previous step
   */
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  /**
   * Navigate to specific step
   */
  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
    }
  };

  /**
   * Load existing business for the authenticated user
   */
  const loadExistingBusiness = async () => {
    setIsLoadingBusiness(true);
    setSubmitError(null);
    try {
      const business = await businessApi.getMyBusiness();
      setExistingBusiness(business);
      
      // Transform business data to form data
      const formData = transformBusinessToFormData(business, enabledServices);
      
      // Populate form with existing business data
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof typeof formData];
        if (value !== undefined) {
          form.setValue(key as keyof BusinessFormData, value as any);
        }
      });
      
      return business;
    } catch (error: any) {
      // 404 means no business exists yet, which is fine
      if (error.response?.status !== 404) {
        console.error('Error loading business:', error);
        setSubmitError(error.response?.data?.message || 'Failed to load business data');
      }
      return null;
    } finally {
      setIsLoadingBusiness(false);
    }
  };

  /**
   * Submit form to backend API
   */
  const submitForm = async () => {
    // Validate all steps before submitting
    const isValid = await form.trigger();
    if (!isValid) {
      const errors = form.formState.errors;
      console.error('Form validation errors:', errors);
      setSubmitError('Please fix the errors in the form before submitting.');
      return { success: false, error: 'Validation failed' };
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = form.getValues();
      console.log('Submitting form data:', formData);
      
      // Ensure required fields are present
      if (!formData.name || !formData.category || !formData.businessType) {
        setSubmitError('Please complete all required fields (Steps 1-3) before submitting.');
        return { success: false, error: 'Missing required fields' };
      }

      if (formData.providesAdServices === undefined || formData.isBuyer === undefined) {
        setSubmitError('Please complete Step 3 (Collaboration Preference) before submitting.');
        return { success: false, error: 'Missing collaboration preferences' };
      }
      
      // Transform form data to backend format
      let business: Business;
      if (existingBusiness) {
        const updateData = transformFormToUpdateData(formData, enabledServices);
        business = await businessApi.updateBusiness(updateData);
      } else {
        const createData = transformFormToCreateData(formData, enabledServices);
        business = await businessApi.createBusiness(createData);
      }

      console.log('Business created/updated successfully:', business);
      setExistingBusiness(business);
      
      // Clear form and localStorage
      form.reset();
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStep(1);

      return { success: true, business };
    } catch (error: any) {
      console.error('Error submitting form:', error);
      console.error('Error response:', error.response?.data);
      
      // Extract error message from response
      let errorMessage = 'Failed to save business. Please try again.';
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          // Laravel validation errors
          const errors = error.response.data.errors;
          const firstError = Object.values(errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
        }
      }
      
      setSubmitError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Get current step progress percentage
   */
  const getProgress = () => {
    return (currentStep / TOTAL_STEPS) * 100;
  };

  return {
    form,
    currentStep,
    totalSteps: TOTAL_STEPS,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    getProgress,
    isSubmitting,
    submitError,
    existingBusiness,
    isLoadingBusiness,
    loadExistingBusiness,
  };
};

