'use client';

import { BusinessFormData } from '../types';
import { Building2, MapPin, Briefcase } from 'lucide-react';

interface BusinessCardPreviewProps {
  data: BusinessFormData;
}

/**
 * Business Card Preview Component
 * Displays a preview of the business profile
 */
export function BusinessCardPreview({ data }: BusinessCardPreviewProps) {
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
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-start mb-3">
          <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
            <Building2 size={32} className="text-primary" />
          </div>
          <div className="flex-grow-1">
            <h4 className="card-title mb-1">{data.name || 'Business Name'}</h4>
            {data.category && (
              <span className="badge bg-primary mb-2">{data.category}</span>
            )}
          </div>
        </div>

        <div className="mb-3">
          {(data.city || data.area || data.location) && (
            <div className="d-flex align-items-center text-muted mb-2">
              <MapPin size={16} className="me-2" />
              <small>{[data.area, data.city].filter(Boolean).join(', ') || data.location}</small>
            </div>
          )}
          {data.businessType && (
            <div className="d-flex align-items-center text-muted mb-2">
              <Briefcase size={16} className="me-2" />
              <small>{getBusinessTypeLabel(data.businessType)}</small>
            </div>
          )}
        </div>

        {data.description && (
          <p className="card-text text-muted small mb-3">{data.description}</p>
        )}

        {data.providesAdServices && (
          <div className="border-top pt-3">
            <h6 className="small fw-bold mb-2">Promotion Intent:</h6>
            <span className="badge bg-info text-capitalize">{data.promotionIntent || 'cross'}</span>
            {(data.supportedCategoryIds || []).length > 0 && (
              <small className="text-muted d-block mt-1">{data.supportedCategoryIds?.length} categories selected</small>
            )}
          </div>
        )}

        {(data.logoFile || (data.brandAssets && data.brandAssets.length > 0)) && (
          <div className="border-top pt-3 mt-3">
            <h6 className="small fw-bold mb-2">Brand Assets:</h6>
            <small className="text-muted">
              {data.logoFile ? 'Logo selected' : ''}
              {data.brandAssets?.length ? ` · ${data.brandAssets.length} additional file(s)` : ''}
            </small>
          </div>
        )}
      </div>
    </div>
  );
}









