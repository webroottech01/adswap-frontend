'use client';

import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';
import { BusinessCardPreview } from '../BusinessCardPreview';
import { Edit } from 'lucide-react';
import { Button } from '@/ui/Button';

interface Step5PreviewProps {
  form: UseFormReturn<BusinessFormData>;
  onEditStep: (step: number) => void;
}

/**
 * Step 5: Preview
 */
export function Step5Preview({ form, onEditStep }: Step5PreviewProps) {
  const data = form.getValues();

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
          <p className="text-muted mb-4">
            Please review all the information below. You can edit any section by clicking the edit button.
          </p>

          {/* Business Card Preview */}
          <div className="mb-4">
            <BusinessCardPreview data={data} />
          </div>

          {/* Detailed Review */}
          <div className="row g-4">
            {/* Step 1 Details */}
            <div className="col-12 col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h6 className="mb-0">Basic Details</h6>
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

            {/* Step 2 Details */}
            <div className="col-12 col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h6 className="mb-0">Business Type</h6>
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
                  {data.description && (
                    <div>
                      <strong>Description:</strong>
                      <div className="text-muted small">{data.description}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3 Details */}
            {data.providesAdServices && (
              <div className="col-12 col-md-6">
                <div className="card h-100">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h6 className="mb-0">Ad Services</h6>
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
                      <strong>Selected Services:</strong>
                      <div>
                        {data.serviceSlugs && data.serviceSlugs.length > 0
                          ? data.serviceSlugs.join(', ')
                          : 'None'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Brand proof details */}
            {data.brandProofs && data.brandProofs.length > 0 && (
              <div className="col-12 col-md-6">
                <div className="card h-100">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h6 className="mb-0">Brand Proof</h6>
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
                        {data.brandProofs.length} file(s) uploaded
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7 Details */}
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
                      onClick={() => onEditStep(6)}
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="card-body">
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
    </div>
  );
}









