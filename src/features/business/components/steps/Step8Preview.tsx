'use client';

import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData, CompletionSection } from '../../types';
import { BusinessCardPreview } from '../BusinessCardPreview';
import { Edit } from 'lucide-react';
import { Button } from '@/ui/Button';

interface Step8PreviewProps {
  form: UseFormReturn<BusinessFormData>;
  onEditStep: (step: number) => void;
  completionPercentage?: number;
  completionSections?: CompletionSection[];
  onSaveDraft?: () => Promise<{ success: boolean } | undefined>;
  onSubmit?: () => Promise<void>;
  onPublish?: () => Promise<void>;
  isSubmitting?: boolean;
  isSavingDraft?: boolean;
}

/**
 * Step 8: Preview (read-only)
 */
export function Step8Preview({
  form,
  onEditStep,
  completionPercentage = 0,
  completionSections = [],
  onSaveDraft,
  onSubmit,
  onPublish,
  isSubmitting,
  isSavingDraft,
}: Step8PreviewProps) {
  const data = form.getValues();
  const missingAlerts = completionSections.filter((s) => s.missing_fields.length > 0);

  const getBusinessTypeLabel = (type: string) => {
    switch (type) {
      case 'individual':
        return 'Individual';
      case 'partnership':
        return 'Partnership';
      case 'company':
        return 'Company';
      default:
        return type;
    }
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Review Your Business Profile</h5>
        </div>
        <div className="card-body">
          <p className="text-muted mb-2">
            Profile completion: <strong>{completionPercentage}%</strong>. Review each section before submitting.
          </p>
          {missingAlerts.length > 0 && (
            <div className="alert alert-warning small">
              <strong>Missing information:</strong>{' '}
              {missingAlerts.map((s) => s.label).join(', ')}
            </div>
          )}

          {/* Business Card Preview */}
          <div className="mb-4">
            <BusinessCardPreview data={data} />
          </div>

          {/* Detailed Review */}
          <div className="row g-4">
            {/* Step 1: Basic Account Info */}
            <div className="col-12 col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h6 className="mb-0">Basic Account Info</h6>
                  <Button
                    variant="secondary"
                    size="sm"
                    outline
                    icon={Edit}
                    onClick={() => onEditStep(1)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <strong>Business Name:</strong>
                    <div>{data.name || 'Not provided'}</div>
                  </div>
                  <div className="mb-2">
                    <strong>Category:</strong>
                    <div>{data.category || 'Not provided'}</div>
                  </div>
                  {data.location && (
                    <div>
                      <strong>Location:</strong>
                      <div>{data.location}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Business Identity */}
            <div className="col-12 col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h6 className="mb-0">Business Identity</h6>
                  <Button
                    variant="secondary"
                    size="sm"
                    outline
                    icon={Edit}
                    onClick={() => onEditStep(2)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <strong>Type:</strong>
                    <div>{data.businessType ? getBusinessTypeLabel(data.businessType) : 'Not provided'}</div>
                  </div>
                  {data.registrationNumber && (
                    <div className="mb-2">
                      <strong>Registration Number:</strong>
                      <div>{data.registrationNumber}</div>
                    </div>
                  )}
                  {data.foundedYear && (
                    <div className="mb-2">
                      <strong>Founded Year:</strong>
                      <div>{data.foundedYear}</div>
                    </div>
                  )}
                  {data.description && (
                    <div>
                      <strong>Description:</strong>
                      <div className="text-muted small">{data.description}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Collaboration Preference */}
            <div className="col-12 col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h6 className="mb-0">Collaboration Preference</h6>
                  <Button
                    variant="secondary"
                    size="sm"
                    outline
                    icon={Edit}
                    onClick={() => onEditStep(3)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <strong>Provides Ad Services:</strong>
                    <div>{data.providesAdServices ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="mb-2">
                    <strong>Is Buyer:</strong>
                    <div>{data.isBuyer ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="mb-2">
                    <strong>Promotion Intent:</strong>
                    <div className="text-capitalize">{data.promotionIntent || 'none'}</div>
                  </div>
                  {(data.supportedCategoryIds?.length ?? 0) > 0 && (
                    <div>
                      <strong>Supported Categories:</strong>
                      <div>{data.supportedCategoryIds?.length} selected</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 4: Business Profile */}
            {(data.scale || data.employeeCount || data.annualRevenueRange || data.targetAudience?.length || data.industryExperienceYears || data.keyProductsServices?.length || data.geographicReach?.length || data.additionalInfo) && (
              <div className="col-12 col-md-6">
                <div className="card h-100">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h6 className="mb-0">Business Profile</h6>
                    <Button
                      variant="secondary"
                      size="sm"
                      outline
                      icon={Edit}
                      onClick={() => onEditStep(4)}
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="card-body">
                    {data.scale && (
                      <div className="mb-2">
                        <strong>Scale:</strong>
                        <div className="text-capitalize">{data.scale}</div>
                      </div>
                    )}
                    {data.employeeCount && (
                      <div className="mb-2">
                        <strong>Employee Count:</strong>
                        <div>{data.employeeCount}</div>
                      </div>
                    )}
                    {data.annualRevenueRange && (
                      <div className="mb-2">
                        <strong>Annual Revenue Range:</strong>
                        <div>{data.annualRevenueRange}</div>
                      </div>
                    )}
                    {data.targetAudience && data.targetAudience.length > 0 && (
                      <div className="mb-2">
                        <strong>Target Audience:</strong>
                        <div>{data.targetAudience.join(', ')}</div>
                      </div>
                    )}
                    {data.industryExperienceYears && (
                      <div className="mb-2">
                        <strong>Industry Experience:</strong>
                        <div>{data.industryExperienceYears} years</div>
                      </div>
                    )}
                    {data.keyProductsServices && data.keyProductsServices.length > 0 && (
                      <div className="mb-2">
                        <strong>Key Products/Services:</strong>
                        <div>{data.keyProductsServices.join(', ')}</div>
                      </div>
                    )}
                    {data.geographicReach && data.geographicReach.length > 0 && (
                      <div className="mb-2">
                        <strong>Geographic Reach:</strong>
                        <div>{data.geographicReach.join(', ')}</div>
                      </div>
                    )}
                    {data.additionalInfo && (
                      <div>
                        <strong>Additional Info:</strong>
                        <div className="text-muted small">{data.additionalInfo}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Collaboration Preferences */}
            {(data.preferredCollaborationTypes?.length || data.budgetRange || data.collaborationNotes) && (
              <div className="col-12 col-md-6">
                <div className="card h-100">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h6 className="mb-0">Collaboration Preferences</h6>
                    <Button
                      variant="secondary"
                      size="sm"
                      outline
                      icon={Edit}
                      onClick={() => onEditStep(5)}
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="card-body">
                    {data.preferredCollaborationTypes && data.preferredCollaborationTypes.length > 0 && (
                      <div className="mb-2">
                        <strong>Preferred Types:</strong>
                        <div>{data.preferredCollaborationTypes.join(', ')}</div>
                      </div>
                    )}
                    {data.budgetRange && (
                      <div className="mb-2">
                        <strong>Budget Range:</strong>
                        <div>{data.budgetRange}</div>
                      </div>
                    )}
                    {data.collaborationNotes && (
                      <div>
                        <strong>Notes:</strong>
                        <div className="text-muted small">{data.collaborationNotes}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Brand Proof */}
            {(data.logoFile || (data.brandAssets && data.brandAssets.length > 0)) && (
              <div className="col-12 col-md-6">
                <div className="card h-100">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h6 className="mb-0">Brand Assets</h6>
                    <Button
                      variant="secondary"
                      size="sm"
                      outline
                      icon={Edit}
                      onClick={() => onEditStep(6)}
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="card-body">
                    <div>
                      <strong>Files:</strong>
                      <div className="text-muted small">
                        {data.logoFile ? 'Logo' : ''}{data.brandAssets?.length ? ` ${data.brandAssets.length} asset(s)` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Business Documents */}
            {data.businessDocuments && data.businessDocuments.length > 0 && (
              <div className="col-12 col-md-6">
                <div className="card h-100">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h6 className="mb-0">Business Documents</h6>
                    <Button
                      variant="secondary"
                      size="sm"
                      outline
                      icon={Edit}
                      onClick={() => onEditStep(7)}
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="card-body">
                    {data.documentType && (
                      <div className="mb-2">
                        <strong>Document Type:</strong>
                        <div className="text-uppercase">{data.documentType}</div>
                      </div>
                    )}
                    <div>
                      <strong>Documents:</strong>
                      <div className="text-muted small">
                        {data.businessDocuments.length} document(s) uploaded
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 justify-content-end mt-4 border-top pt-3">
        {onSaveDraft && (
          <Button variant="secondary" outline onClick={onSaveDraft} disabled={isSavingDraft}>
            {isSavingDraft ? 'Saving...' : 'Save Draft'}
          </Button>
        )}
        {onSubmit && (
          <Button variant="primary" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </Button>
        )}
        {onPublish && (
          <Button variant="primary" outline onClick={onPublish} disabled={isSubmitting}>
            Publish Profile
          </Button>
        )}
      </div>
    </div>
  );
}




