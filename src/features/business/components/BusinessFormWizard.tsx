'use client';

import { useBusinessForm } from '../hooks/useBusinessForm';
import { Business } from '../api';
import { BusinessStepper } from './BusinessStepper';
import { Step1BasicDetails } from './steps/Step1BasicDetails';
import { Step2BusinessIdentity } from './steps/Step2BusinessIdentity';
import { Step3CollaborationPreference } from './steps/Step3CollaborationPreference';
import { Step4BusinessProfile } from './steps/Step4BusinessProfile';
import { Step5CollaborationPreferences } from './steps/Step5CollaborationPreferences';
import { Step6BrandProof } from './steps/Step6BrandProof';
import { Step7BusinessDocuments } from './steps/Step7BusinessDocuments';
import { Step8Preview } from './steps/Step8Preview';
import { Button } from '@/ui/Button';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

interface BusinessFormWizardProps {
  onClose: () => void;
  onSuccess?: () => void;
  business?: Business; // Optional business prop to indicate edit mode
}

/**
 * Business Form Wizard Component
 * Orchestrates the multi-step form
 */
export function BusinessFormWizard({ onClose, onSuccess, business }: BusinessFormWizardProps) {
  const {
    form,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    getProgress,
    isSubmitting,
    submitError,
    existingBusiness,
  } = useBusinessForm();

  // Determine if we're in edit mode
  const isEditMode = existingBusiness !== null || business !== undefined;
  const title = isEditMode ? 'Edit Business Profile' : 'Create Business Profile';

  const handleSubmit = async () => {
    const result = await submitForm();
    if (result?.success) {
      onSuccess?.();
      onClose();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicDetails form={form} />;
      case 2:
        return <Step2BusinessIdentity form={form} />;
      case 3:
        return <Step3CollaborationPreference form={form} />;
      case 4:
        return <Step4BusinessProfile form={form} />;
      case 5:
        return <Step5CollaborationPreferences form={form} />;
      case 6:
        return <Step6BrandProof form={form} />;
      case 7:
        return <Step7BusinessDocuments form={form} />;
      case 8:
        return <Step8Preview form={form} onEditStep={goToStep} />;
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
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            <div className="card-body">
              {/* Stepper */}
              <BusinessStepper currentStep={currentStep} />

              {/* Step Content */}
              <div className="mb-4">{renderStep()}</div>

              {/* Error Message */}
              {submitError && (
                <div className="alert alert-danger mb-3" role="alert">
                  {submitError}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                <Button
                  variant="secondary"
                  outline
                  icon={ArrowLeft}
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>

                {currentStep === totalSteps ? (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={nextStep}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

