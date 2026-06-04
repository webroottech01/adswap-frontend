'use client';

import { OPTIONAL_STEPS } from '../types';
import { useBusinessForm } from '../hooks/useBusinessForm';
import { Business } from '../api';
import { BusinessStepper } from './BusinessStepper';
import { ProfileCompletionBanner } from './ProfileCompletionBanner';
import { Step1BasicDetails } from './steps/Step1BasicDetails';
import { Step2BusinessIdentity } from './steps/Step2BusinessIdentity';
import { Step3PromotionIntent } from './steps/Step3PromotionIntent';
import { Step4BusinessProfile } from './steps/Step4BusinessProfile';
import { Step5CollaborationPreferences } from './steps/Step5CollaborationPreferences';
import { Step6BrandAssets } from './steps/Step6BrandAssets';
import { Step7BusinessVerification } from './steps/Step7BusinessVerification';
import { Step8Preview } from './steps/Step8Preview';
import { Button } from '@/ui/Button';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

interface BusinessFormWizardProps {
  onClose: () => void;
  onSuccess?: () => void;
  business?: Business;
}

export function BusinessFormWizard({ onClose, onSuccess, business }: BusinessFormWizardProps) {
  const {
    form,
    currentStep,
    totalSteps,
    maxReachableStep,
    nextStep,
    prevStep,
    goToStep,
    skipStep,
    saveDraft,
    submitForm,
    completionPercentage,
    completionSections,
    isSubmitting,
    isSavingDraft,
    submitError,
    existingBusiness,
    isLoadingBusiness,
    uploadRevision,
  } = useBusinessForm();

  const isEditMode = existingBusiness !== null || business !== undefined;
  const title = isEditMode ? 'Edit Business Profile' : 'Create Business Profile';

  const handleSubmit = async () => {
    const result = await submitForm(true);
    if (result?.success) {
      onSuccess?.();
      onClose();
    }
  };

  const handlePublish = handleSubmit;

  if (isLoadingBusiness) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 text-muted">Loading your profile...</p>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicDetails form={form} />;
      case 2:
        return <Step2BusinessIdentity form={form} />;
      case 3:
        return <Step3PromotionIntent form={form} />;
      case 4:
        return <Step4BusinessProfile form={form} />;
      case 5:
        return <Step5CollaborationPreferences form={form} />;
      case 6:
        return (
          <Step6BrandAssets
            form={form}
            existingBusiness={existingBusiness}
            uploadRevision={uploadRevision}
          />
        );
      case 7:
        return (
          <Step7BusinessVerification
            form={form}
            existingBusiness={existingBusiness}
            uploadRevision={uploadRevision}
            verificationStatus={existingBusiness?.verification_status}
          />
        );
      case 8:
        return (
          <Step8Preview
            form={form}
            onEditStep={goToStep}
            completionPercentage={completionPercentage}
            completionSections={completionSections}
            onSaveDraft={saveDraft}
            onSubmit={handleSubmit}
            onPublish={handlePublish}
            isSubmitting={isSubmitting}
            isSavingDraft={isSavingDraft}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="card shadow-sm">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div>
                <h4 className="mb-0">{title}</h4>
                <small className="text-muted">Step {currentStep} of {totalSteps}</small>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <div className="card-body">
              <ProfileCompletionBanner percentage={completionPercentage} sections={completionSections} />

              <BusinessStepper
                currentStep={currentStep}
                maxReachableStep={maxReachableStep}
                completionPercentage={completionPercentage}
                onStepClick={goToStep}
              />

              <div className="mb-4">{renderStep()}</div>

              {submitError && (
                <div className="alert alert-danger mb-3" role="alert">
                  {submitError}
                </div>
              )}

              {currentStep < 8 && (
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <Button variant="secondary" outline icon={ArrowLeft} onClick={prevStep} disabled={currentStep === 1}>
                    Back
                  </Button>

                  <div className="d-flex gap-2">
                    {OPTIONAL_STEPS.includes(currentStep) && (
                      <Button variant="secondary" outline onClick={skipStep} disabled={isSavingDraft}>
                        Skip
                      </Button>
                    )}
                    <Button variant="secondary" outline onClick={saveDraft} disabled={isSavingDraft}>
                      {isSavingDraft ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button variant="primary" icon={ArrowRight} iconPosition="right" onClick={nextStep} disabled={isSavingDraft}>
                      {isSavingDraft ? 'Saving...' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
